import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import { getAvailableLanguages, setLanguage } from '../i18n/i18n';

const LanguageSelector = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { i18n, t } = useTranslation();
  const theme = getTheme(isDarkMode);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const languages = getAvailableLanguages();
  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  const handleLanguageSelect = async (languageCode) => {
    setLoading(true);
    try {
      await setLanguage(languageCode);
      setModalVisible(false);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.cardBg }]}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="translate" size={24} color={theme.colors.primary} />
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>
          {currentLanguage ? currentLanguage.nativeName : 'Select Language'}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.text} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {t('common.selectLanguage', 'Select Language')}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Languages List */}
          <ScrollView style={styles.languagesList}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : (
              languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    {
                      backgroundColor:
                        i18n.language === language.code ? theme.colors.cardBg : 'transparent',
                      borderLeftColor:
                        i18n.language === language.code ? theme.colors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={[styles.languageCode, { color: theme.colors.text }]}>
                      {language.code}
                    </Text>
                    <Text style={[styles.languageName, { color: theme.colors.textSecondary }]}>
                      {language.nativeName}
                    </Text>
                    <Text style={[styles.languageEnglish, { color: theme.colors.textSecondary }]}>
                      {language.englishName}
                    </Text>
                  </View>

                  {i18n.language === language.code && (
                    <MaterialCommunityIcons name="check" size={24} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  buttonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  languagesList: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  languageInfo: {
    flex: 1,
  },
  languageCode: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  languageName: {
    fontSize: 14,
    marginBottom: 2,
  },
  languageEnglish: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LanguageSelector;
