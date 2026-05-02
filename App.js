import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { FlowProvider } from './src/context/FlowContext';

export default function App() {
  return (
    <FlowProvider>
 <AppNavigator />
   
    </FlowProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
