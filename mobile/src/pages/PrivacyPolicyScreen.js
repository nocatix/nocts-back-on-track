import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

const PrivacyPolicyScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const insets = useSafeAreaInsets();
  const [expandedSections, setExpandedSections] = useState({
    why: true,
    where: false,
    protect: false,
    dont: false,
    rights: false,
    deployment: false,
    technical: false,
    changes: false,
  });

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const SectionHeader = ({ id, icon, title, onPress, isExpanded }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.sectionHeader, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      <MaterialCommunityIcons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={24}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );

  const SectionContent = ({ children }) => (
    <View style={[styles.sectionContent, { backgroundColor: theme.colors.surfaceBackground }]}>
      {children}
    </View>
  );

  const ListItem = ({ text }) => (
    <View style={styles.listItem}>
      <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
      <Text style={[styles.listItemText, { color: theme.colors.text }]}>{text}</Text>
    </View>
  );

  const Highlight = ({ text }) => (
    <View style={[styles.highlightBox, { backgroundColor: theme.colors.cardBg, borderLeftColor: theme.colors.primary }]}>
      <Text style={[styles.highlightText, { color: theme.colors.text }]}>{text}</Text>
    </View>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 40,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <Text style={[styles.bannerTitle, { color: theme.colors.primary }]}>
          💚 Open Source • Free • No Ads • No Tracking
        </Text>
        <Text style={[styles.bannerText, { color: theme.colors.text }]}>
          Back on Track is completely free, open source software. We will{' '}
          <Text style={{ fontWeight: 'bold' }}>NEVER</Text> display ads, collect tracking data, or monetize your
          information.
        </Text>
      </View>

      {/* Title */}
      <Text style={[styles.pageTitle, { color: theme.colors.text }]}>🔒 Privacy Policy</Text>
      <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>Last Updated: March 31, 2026</Text>

      {/* What We Collect */}
      <SectionHeader
        id="why"
        icon="📋"
        title="What We Collect"
        onPress={() => toggleSection('why')}
        isExpanded={expandedSections.why}
      />
      {expandedSections.why && (
        <SectionContent>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            Back on Track collects the following information to help you track your addiction recovery journey:
          </Text>
          <ListItem text="Account Information: Your full name, username, and encrypted password" />
          <ListItem text="Addiction Data: The addictions you're tracking, start dates, daily frequency, and money spent" />
          <ListItem text="Diary Entries: Any personal reflections and notes you write in your daily diary" />
          <ListItem text="Achievement Data: Milestones you reach and when you reach them" />
          <ListItem text="Session Data: Login times and basic usage patterns (not tracked individually)" />
        </SectionContent>
      )}

      {/* Where Stored */}
      <SectionHeader
        id="where"
        icon="🗄️"
        title="Where Your Data is Stored"
        onPress={() => toggleSection('where')}
        isExpanded={expandedSections.where}
      />
      {expandedSections.where && (
        <SectionContent>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            Your data is stored in a MongoDB database that is hosted locally or on your own server infrastructure. All
            data remains under your control and is not sent to external servers or cloud providers by default.
          </Text>
          <Text style={[styles.text, { color: theme.colors.text, marginTop: 12 }]}>
            When deployed using Docker Compose (as recommended), the MongoDB database runs in a Docker container on your
            own machine or private server.
          </Text>
        </SectionContent>
      )}

      {/* How Protected */}
      <SectionHeader
        id="protect"
        icon="🛡️"
        title="How Your Data is Protected"
        onPress={() => toggleSection('protect')}
        isExpanded={expandedSections.protect}
      />
      {expandedSections.protect && (
        <SectionContent>
          <ListItem text="Password Encryption: All passwords are encrypted using bcryptjs with 10 salt rounds" />
          <ListItem text="Authentication: JSON Web Tokens (JWT) are used for session security" />
          <ListItem text="HTTPS Ready: The application supports HTTPS when deployed in production" />
          <ListItem text="Database Security: MongoDB can be configured with authentication and network isolation" />
          <ListItem text="No Third Parties: Your data is never shared with advertisers or third parties" />
        </SectionContent>
      )}

      {/* What We Don't Do */}
      <SectionHeader
        id="dont"
        icon="❌"
        title="What We Don't Do"
        onPress={() => toggleSection('dont')}
        isExpanded={expandedSections.dont}
      />
      {expandedSections.dont && (
        <SectionContent>
          <ListItem text="We do not track your location" />
          <ListItem text="We do not collect analytics or metrics about your behavior" />
          <ListItem text="We do not share your data with any external services" />
          <ListItem text="We do not display ads or sell your information" />
          <ListItem text="We do not use cookies for tracking (only for basic session management)" />
          <ListItem text="We do not access your personal files or contacts" />
        </SectionContent>
      )}

      {/* Your Rights */}
      <SectionHeader
        id="rights"
        icon="⚖️"
        title="Your Rights"
        onPress={() => toggleSection('rights')}
        isExpanded={expandedSections.rights}
      />
      {expandedSections.rights && (
        <SectionContent>
          <Text style={[styles.text, { color: theme.colors.text }]}>You have full control over your data:</Text>
          <ListItem text="Access: You can view all your personal data at any time through the application" />
          <ListItem text="Modification: You can edit or delete any of your addiction records, diary entries, or account information" />
          <ListItem text="Export: Since you control the database, you can export all your data at any time" />
          <ListItem text="Deletion: You can delete your entire account and all associated data" />
        </SectionContent>
      )}

      {/* Deployment Scenarios */}
      <SectionHeader
        id="deployment"
        icon="🚀"
        title="Deployment Scenarios"
        onPress={() => toggleSection('deployment')}
        isExpanded={expandedSections.deployment}
      />
      {expandedSections.deployment && (
        <SectionContent>
          <Text style={[styles.subheading, { color: theme.colors.text }]}>Local Deployment (Recommended)</Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            When you run Back on Track on your own machine using Docker Compose, all data stays completely on your
            device. No data leaves your computer unless you explicitly configure it to do so.
          </Text>

          <Text style={[styles.subheading, { color: theme.colors.text, marginTop: 16 }]}>Private Server Deployment</Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            If deployed on a private server you own or control, your data is protected by your server's security
            policies. Choose a server in a jurisdiction you trust.
          </Text>

          <Highlight text="⚠️ Do not deploy Back on Track on public servers without proper security configuration (SSL/TLS, firewalls, authentication)." />
        </SectionContent>
      )}

      {/* Technical Details */}
      <SectionHeader
        id="technical"
        icon="🔧"
        title="Technical Details"
        onPress={() => toggleSection('technical')}
        isExpanded={expandedSections.technical}
      />
      {expandedSections.technical && (
        <SectionContent>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            <Text style={{ fontWeight: 'bold' }}>Frontend:</Text> React application that runs entirely in your browser.
            No tracking cookies are enabled.
          </Text>
          <Text style={[styles.text, { color: theme.colors.text, marginTop: 12 }]}>
            <Text style={{ fontWeight: 'bold' }}>Backend:</Text> Node.js Express server that processes your requests
            and stores data in MongoDB.
          </Text>
          <Text style={[styles.text, { color: theme.colors.text, marginTop: 12 }]}>
            <Text style={{ fontWeight: 'bold' }}>Database:</Text> MongoDB with optional authentication. You can configure
            encryption at rest based on your deployment.
          </Text>
          <Text style={[styles.text, { color: theme.colors.text, marginTop: 12 }]}>
            <Text style={{ fontWeight: 'bold' }}>Open Source:</Text> The complete source code is available for inspection.
            You can audit the codebase to verify our privacy claims.
          </Text>
        </SectionContent>
      )}

      {/* Changes to Policy */}
      <SectionHeader
        id="changes"
        icon="📝"
        title="Changes to This Policy"
        onPress={() => toggleSection('changes')}
        isExpanded={expandedSections.changes}
      />
      {expandedSections.changes && (
        <SectionContent>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            We may update this policy as the application evolves. You will be notified of significant changes. The
            latest version is always available in the application.
          </Text>
        </SectionContent>
      )}

      {/* Commitment */}
      <View style={[styles.commitmentBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.primary }]}>
        <Text style={[styles.commitmentTitle, { color: theme.colors.primary }]}>Our Commitment to You</Text>
        <Text style={[styles.commitmentText, { color: theme.colors.text }]}>
          Recovery is hard enough without worrying about your privacy. We commit to:
        </Text>
        <ListItem text="Keeping your data private and secure" />
        <ListItem text="Never selling or sharing your information" />
        <ListItem text="Making it easy for you to control your data" />
        <ListItem text="Being transparent about how we handle information" />
        <ListItem text="Supporting your recovery journey unconditionally" />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  banner: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 8,
  },
  bullet: {
    marginRight: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  highlightBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
  },
  highlightText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  commitmentBox: {
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 2,
  },
  commitmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commitmentText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
});

export default PrivacyPolicyScreen;
