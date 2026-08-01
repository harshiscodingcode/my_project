import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

// TARGET_URL should be the full HTTPS URL of the deployed Next.js application.
// We are hardcoding the Vercel deployed instance you use, but this can be changed.
const TARGET_URL = 'https://my-project-ten-weld-39.vercel.app';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        {/* WebView keeps the deployed Next.js app inside the native shell. */}
        <WebView
          source={{ uri: TARGET_URL }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e17', // Darkest theme background
  },
  safeArea: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
