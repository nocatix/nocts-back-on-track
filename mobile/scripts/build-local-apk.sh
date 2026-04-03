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
JAVA_CANDIDATES=(
	"/usr/lib/jvm/java-21-openjdk"
	"/usr/lib/jvm/java-21"
	"/usr/lib/jvm/java-17-openjdk"
	"/usr/lib/jvm/java-17"
)

JAVA_HOME_SELECTED=""
for candidate in "${JAVA_CANDIDATES[@]}"; do
	if [[ -x "$candidate/bin/java" ]]; then
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

if [[ "$MODE" == "debug" ]]; then
	TASK=":app:assembleDebug"
else
	TASK=":app:assembleRelease"
fi

echo "Using JAVA_HOME=$JAVA_HOME"
echo "Running Gradle task $TASK"

cd "$ANDROID_DIR"
./gradlew "$TASK" --no-daemon --stacktrace "$@"

if [[ "$MODE" == "debug" ]]; then
	echo "APK path: $ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
else
	echo "APK path: $ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
fi
