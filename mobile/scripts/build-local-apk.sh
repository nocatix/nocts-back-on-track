#!/usr/bin/env bash

set -euo pipefail

MODE="${1:-release}"
shift || true

case "$MODE" in
	debug|release)
		;;
	*)
		echo "Invalid mode: $MODE"
		echo "Usage: bash scripts/build-local-apk.sh [debug|release] [extra-gradle-args...]"
		exit 2
		;;
esac

# Prefer Java 21/17 to avoid Groovy parser issues with very new JDKs (e.g. Java 25).
# Check JAVA_HOME first (e.g. set by CI via actions/setup-java), then fall back to
# well-known system paths.
JAVA_CANDIDATES=(
	"${JAVA_HOME:-}"
	"/usr/lib/jvm/java-21-openjdk"
	"/usr/lib/jvm/java-21"
	"/usr/lib/jvm/java-17-openjdk"
	"/usr/lib/jvm/java-17"
)

JAVA_HOME_SELECTED=""
for candidate in "${JAVA_CANDIDATES[@]}"; do
	if [[ -n "$candidate" && -x "$candidate/bin/java" ]]; then
		JAVA_HOME_SELECTED="$candidate"
		break
	fi
done

if [[ -z "$JAVA_HOME_SELECTED" ]]; then
	echo "Could not find a compatible Java runtime (expected Java 21 or 17)."
	echo "Install one of: java-21-openjdk or java-17-openjdk."
	exit 3
fi

export JAVA_HOME="$JAVA_HOME_SELECTED"
export PATH="$JAVA_HOME/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$(cd "$SCRIPT_DIR/../android" && pwd)"
MOBILE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

SDK_CANDIDATES=(
	"${ANDROID_HOME:-}"
	"${ANDROID_SDK_ROOT:-}"
	"$HOME/Android/Sdk"
	"/opt/android-sdk"
	"/usr/lib/android-sdk"
	"/usr/local/android-sdk"
)

ANDROID_SDK_SELECTED=""
for candidate in "${SDK_CANDIDATES[@]}"; do
	if [[ -n "$candidate" && -d "$candidate/platforms" ]]; then
		ANDROID_SDK_SELECTED="$candidate"
		break
	fi
done

if [[ -z "$ANDROID_SDK_SELECTED" ]]; then
	echo "Android SDK not found."
	echo "Set ANDROID_HOME or install SDK at ~/Android/Sdk."
	exit 4
fi

export ANDROID_HOME="$ANDROID_SDK_SELECTED"
export ANDROID_SDK_ROOT="$ANDROID_SDK_SELECTED"

LOCAL_PROPERTIES="$ANDROID_DIR/local.properties"
SDK_ESCAPED="${ANDROID_SDK_SELECTED//\\/\\\\}"
if [[ ! -f "$LOCAL_PROPERTIES" ]] || ! grep -q "^sdk.dir=$SDK_ESCAPED$" "$LOCAL_PROPERTIES"; then
	printf 'sdk.dir=%s\n' "$SDK_ESCAPED" > "$LOCAL_PROPERTIES"
fi

if [[ "$MODE" == "debug" ]]; then
	TASK=":app:assembleDebug"
else
	TASK=":app:assembleRelease"
fi

echo "Using JAVA_HOME=$JAVA_HOME"
echo "Using ANDROID_HOME=$ANDROID_HOME"
echo "Running Gradle task $TASK"

SLIDER_HEADER="$MOBILE_DIR/node_modules/@react-native-community/slider/common/cpp/react/renderer/components/RNCSlider/RNCSliderMeasurementsManager.h"
if [[ -f "$SLIDER_HEADER" ]] && grep -q "ContextContainer::Shared" "$SLIDER_HEADER"; then
	echo "Applying local slider C++ compatibility patch"
	sed -i 's/ContextContainer::Shared/std::shared_ptr<const ContextContainer>/g' "$SLIDER_HEADER"
	if ! grep -q '^#include <memory>$' "$SLIDER_HEADER"; then
		sed -i '/#include <react\/utils\/ContextContainer.h>/a #include <memory>' "$SLIDER_HEADER"
	fi
fi

cd "$ANDROID_DIR"
./gradlew "$TASK" --no-daemon --stacktrace "$@"

if [[ "$MODE" == "debug" ]]; then
	echo "APK path: $ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
else
	echo "APK path: $ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
fi
