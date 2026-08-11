import React, { useEffect, useState } from 'react';

import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from './ThemeContext';


// ==================================================
// COLORS
// ==================================================

const RED = '#E50914';
const BLACK = '#090909';
const WHITE = '#FFFFFF';
const GREY = '#999999';


// ==================================================
// LOADING SCREEN
// ==================================================

function LoadingScreen() {
  return (
    <View style={styles.loadingScreen}>

      <Text style={styles.loadingMask}>🎭</Text>

      <Text style={styles.loadingTitle}>
        JOIN THE HEIST
      </Text>

      <Text style={styles.loadingSubtitle}>
        The Professor is waiting...
      </Text>

      <View style={styles.loadingLine} />

      <Text style={styles.loadingText}>
        Decrypting the Professor's
      </Text>

      <Text style={styles.loadingRedText}>
        Blueprint...
      </Text>

    </View>
  );
}


// ==================================================
// LOGIN SCREEN
// ==================================================

function LoginScreen({ goToSignup, onLogin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const login = async () => {

    setError('');

    if (!email || !password) {
      setError('Email aur password dono bharna hai.');
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError('Please enter a valid email.');
      return;
    }

    const savedUser =
      await AsyncStorage.getItem('user');

    if (!savedUser) {
      setError('No recruit found. Please join the heist first.');
      return;
    }

    const user = JSON.parse(savedUser);

    if (
      user.email !== email ||
      user.password !== password
    ) {
      setError('Incorrect email or password.');
      return;
    }

    onLogin(user);
  };

  return (
    <SafeAreaView style={styles.authContainer}>

      <ScrollView
        contentContainerStyle={styles.authContent}
      >

        <Text style={styles.authMask}>🎭</Text>

        <Text style={styles.authTitle}>
          WELCOME BACK
        </Text>

        <Text style={styles.authSubtitle}>
          The Professor has been waiting for you.
        </Text>

        <View style={styles.redLine} />

        <Text style={styles.inputLabel}>
          EMAIL
        </Text>

        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
          ]}
          placeholder="Enter your email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.inputLabel}>
          PASSWORD
        </Text>

        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
          ]}
          placeholder="Enter your password"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        <Pressable
          style={styles.mainButton}
          onPress={login}
        >
          <Text style={styles.mainButtonText}>
            ENTER THE OPERATION
          </Text>
        </Pressable>

        <Text style={styles.switchText}>
          New recruit?
        </Text>

        <Pressable onPress={goToSignup}>
          <Text style={styles.switchButton}>
            JOIN THE HEIST →
          </Text>
        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
}


// ==================================================
// SIGNUP SCREEN
// ==================================================

function SignupScreen({ goToLogin, onSignup }) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({});


  // Yaha profile picture select hoti hai
  const pickImage = async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo access.'
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const signup = async () => {

    const newErrors = {};

    // Yaha name ki basic validation hoti hai
    const namePattern = /^[A-Za-z ]+$/;

    if (
      !name ||
      name.length < 2 ||
      !namePattern.test(name)
    ) {
      newErrors.name =
        'Name must contain only alphabets and spaces.';
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      newErrors.email =
        'Enter a valid email address.';
    }

    if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile =
        'Mobile number must have 10 digits.';
    }

    // Password ki basic validation yaha check hoti hai
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordPattern.test(password)) {
      newErrors.password =
        'Password must have 8+ characters, uppercase, lowercase, number and special character.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        'Passwords do not match.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const user = {
      name,
      email,
      mobile,
      password,
      image,
    };

    await AsyncStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    Alert.alert(
      'Welcome to the Crew',
      'Your registration is complete.'
    );

    onSignup(user);
  };


  return (
    <SafeAreaView style={styles.authContainer}>

      <ScrollView
        contentContainerStyle={styles.authContent}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.authMask}>🎭</Text>

        <Text style={styles.authTitle}>
          JOIN THE HEIST
        </Text>

        <Text style={styles.authSubtitle}>
          Every recruit has a role. What's yours?
        </Text>

        <View style={styles.redLine} />


        {/* PROFILE IMAGE */}

        <Pressable
          style={styles.profilePicker}
          onPress={pickImage}
        >

          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.cameraText}>
              📷
            </Text>
          )}

        </Pressable>

        <Text style={styles.photoHint}>
          Add Profile Picture
        </Text>


        {/* NAME */}

        <Text style={styles.inputLabel}>
          FULL NAME
        </Text>

        <TextInput
          style={[
            styles.input,
            errors.name && styles.inputError,
          ]}
          placeholder="Enter your full name"
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
        />

        {errors.name ? (
          <Text style={styles.errorText}>
            {errors.name}
          </Text>
        ) : null}


        {/* EMAIL */}

        <Text style={styles.inputLabel}>
          EMAIL
        </Text>

        <TextInput
          style={[
            styles.input,
            errors.email && styles.inputError,
          ]}
          placeholder="Enter your email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {errors.email ? (
          <Text style={styles.errorText}>
            {errors.email}
          </Text>
        ) : null}


        {/* MOBILE */}

        <Text style={styles.inputLabel}>
          MOBILE NUMBER
        </Text>

        <TextInput
          style={[
            styles.input,
            errors.mobile && styles.inputError,
          ]}
          placeholder="10 digit mobile number"
          placeholderTextColor="#777"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
          maxLength={10}
        />

        {errors.mobile ? (
          <Text style={styles.errorText}>
            {errors.mobile}
          </Text>
        ) : null}


        {/* PASSWORD */}

        <Text style={styles.inputLabel}>
          PASSWORD
        </Text>

        <TextInput
          style={[
            styles.input,
            errors.password && styles.inputError,
          ]}
          placeholder="Create a strong password"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errors.password ? (
          <Text style={styles.errorText}>
            {errors.password}
          </Text>
        ) : null}


        {/* CONFIRM PASSWORD */}

        <Text style={styles.inputLabel}>
          CONFIRM PASSWORD
        </Text>

        <TextInput
          style={[
            styles.input,
            errors.confirmPassword &&
              styles.inputError,
          ]}
          placeholder="Confirm your password"
          placeholderTextColor="#777"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {errors.confirmPassword ? (
          <Text style={styles.errorText}>
            {errors.confirmPassword}
          </Text>
        ) : null}


        <Pressable
          style={styles.mainButton}
          onPress={signup}
        >
          <Text style={styles.mainButtonText}>
            JOIN THE CREW
          </Text>
        </Pressable>


        <Text style={styles.switchText}>
          Already part of the operation?
        </Text>

        <Pressable onPress={goToLogin}>
          <Text style={styles.switchButton}>
            LOGIN →
          </Text>
        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
}


// ==================================================
// DASHBOARD HEADER
// ==================================================

function Header({ user }) {

  const initial =
    user?.name
      ? user.name.charAt(0).toUpperCase()
      : 'P';

  return (
    <View style={styles.header}>

      <View>

        <Text style={styles.headerSmall}>
          PROFESSOR'S CONTROL
        </Text>

        <Text style={styles.headerTitle}>
          THE OPERATION
        </Text>

      </View>

      <View style={styles.initialCircle}>

        <Text style={styles.initialText}>
          {initial}
        </Text>

      </View>

    </View>
  );
}


// ==================================================
// BALANCE
// ==================================================

function Balance() {

  const { theme } = useTheme();

  const textColor =
    theme === 'dark'
      ? WHITE
      : '#161616';

  const secondaryColor =
    theme === 'dark'
      ? GREY
      : '#666666';

  return (
    <View style={styles.balanceSection}>

      <Text
        style={[
          styles.smallText,
          { color: secondaryColor },
        ]}
      >
        TOTAL BALANCE  ◉
      </Text>

      <Text
        style={[
          styles.balance,
          { color: textColor },
        ]}
      >
        ₹12,765.00
      </Text>

      <Text
        style={[
          styles.subBalance,
          { color: secondaryColor },
        ]}
      >
        Your crew's current balance
      </Text>

    </View>
  );
}


// ==================================================
// ACTION BUTTON
// ==================================================

function ActionButton({
  symbol,
  title,
  onPress,
}) {

  return (
    <Pressable
      style={styles.actionButton}
      onPress={onPress}
    >

      <View style={styles.actionIcon}>

        <Text style={styles.actionSymbol}>
          {symbol}
        </Text>

      </View>

      <Text style={styles.actionText}>
        {title}
      </Text>

    </Pressable>
  );
}


// ==================================================
// QUICK ACTIONS
// ==================================================

function QuickActions() {

  const {
    theme,
    changeTheme,
  } = useTheme();

  return (
    <View style={styles.actionsRow}>

      <ActionButton
        symbol="↑"
        title="Send"
        onPress={() =>
          Alert.alert(
            'Send Money',
            'Prepare the transfer for your crew.'
          )
        }
      />

      <ActionButton
        symbol="↓"
        title="Receive"
        onPress={() =>
          Alert.alert(
            'Receive Money',
            'Waiting for incoming funds.'
          )
        }
      />

      <ActionButton
        symbol="⇄"
        title="Request"
        onPress={() =>
          Alert.alert(
            'Request Money',
            'Create a request from your crew.'
          )
        }
      />

      <Pressable
        style={styles.actionButton}
        onPress={changeTheme}
      >

        <View style={styles.actionIcon}>

          <Text style={styles.actionSymbol}>
            {theme === 'dark'
              ? '☀'
              : '🌙'}
          </Text>

        </View>

        <Text style={styles.actionText}>
          {theme === 'dark'
            ? 'Planning'
            : 'Heist'}
        </Text>

      </Pressable>

    </View>
  );
}


// ==================================================
// PROMO CARD
// ==================================================

function PromoCard() {

  const { theme } = useTheme();

  const cardColor =
    theme === 'dark'
      ? '#171717'
      : WHITE;

  const titleColor =
    theme === 'dark'
      ? WHITE
      : '#161616';

  const textColor =
    theme === 'dark'
      ? GREY
      : '#666666';

  return (
    <View
      style={[
        styles.promoCard,
        { backgroundColor: cardColor },
      ]}
    >

      <View style={styles.promoContent}>

        <Text
          style={[
            styles.promoTitle,
            { color: titleColor },
          ]}
        >
          Plan. Hack. Earn.
        </Text>

        <Text
          style={[
            styles.promoText,
            { color: textColor },
          ]}
        >
          Invite your crew and earn cashback.
        </Text>

        <Pressable
          style={styles.inviteButton}
          onPress={() =>
            Alert.alert(
              'Crew Invitation',
              'Your invitation is ready.'
            )
          }
        >

          <Text style={styles.inviteText}>
            Invite Now →
          </Text>

        </Pressable>

      </View>

      <Text style={styles.promoMask}>
        🎭
      </Text>

    </View>
  );
}


// ==================================================
// TRANSACTION
// ==================================================

function Transaction({
  symbol,
  title,
  date,
  amount,
  positive,
}) {

  const { theme } = useTheme();

  const titleColor =
    theme === 'dark'
      ? WHITE
      : '#161616';

  const dateColor =
    theme === 'dark'
      ? '#888888'
      : '#666666';

  return (
    <View style={styles.transaction}>

      <View style={styles.transactionIcon}>

        <Text style={styles.transactionSymbol}>
          {symbol}
        </Text>

      </View>

      <View style={styles.transactionInfo}>

        <Text
          style={[
            styles.transactionTitle,
            { color: titleColor },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.transactionDate,
            { color: dateColor },
          ]}
        >
          {date}
        </Text>

      </View>

      <Text
        style={[
          styles.amount,
          positive
            ? styles.positive
            : styles.negative,
        ]}
      >
        {amount}
      </Text>

    </View>
  );
}


// ==================================================
// TRANSACTIONS
// ==================================================

function Transactions() {

  const { theme } = useTheme();

  const sectionColor =
    theme === 'dark'
      ? WHITE
      : '#161616';

  return (
    <View style={styles.transactionsSection}>

      <Text
        style={[
          styles.sectionTitle,
          { color: sectionColor },
        ]}
      >
        RECENT TRANSACTIONS
      </Text>

      <Transaction
        symbol="↑"
        title="Money Sent to Berlin"
        date="Today, 10:30 AM"
        amount="-₹250.00"
        positive={false}
      />

      <Transaction
        symbol="↓"
        title="Received from Nairobi"
        date="Yesterday, 08:45 PM"
        amount="+₹580.00"
        positive
      />

      <Transaction
        symbol="▣"
        title="La Casa Supplies"
        date="Yesterday, 07:10 PM"
        amount="-₹199.00"
        positive={false}
      />

      <Transaction
        symbol="▣"
        title="Heist Bonus"
        date="05 May, 09:15 AM"
        amount="+₹1,200.00"
        positive
      />

    </View>
  );
}


// ==================================================
// PROFILE SCREEN
// ==================================================

function ProfileScreen({
  user,
  onBack,
  onLogout,
}) {

  const { theme } = useTheme();

  const background =
    theme === 'dark'
      ? BLACK
      : '#F4F1EA';

  const textColor =
    theme === 'dark'
      ? WHITE
      : '#161616';

  const cardColor =
    theme === 'dark'
      ? '#171717'
      : WHITE;

  const initial =
    user.name.charAt(0).toUpperCase();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: background },
      ]}
    >

      <ScrollView
        contentContainerStyle={styles.profileContent}
      >

        <Pressable onPress={onBack}>
          <Text style={styles.backButton}>
            ← BACK TO OPERATION
          </Text>
        </Pressable>

        <Text
          style={[
            styles.profileTitle,
            { color: textColor },
          ]}
        >
          THE PROFESSOR'S FILE
        </Text>

        <View style={styles.profileImageContainer}>

          {user.image ? (

            <Image
              source={{ uri: user.image }}
              style={styles.largeProfileImage}
            />

          ) : (

            <View style={styles.initialProfile}>
              <Text style={styles.largeInitial}>
                {initial}
              </Text>
            </View>

          )}

        </View>

        <Text
          style={[
            styles.profileName,
            { color: textColor },
          ]}
        >
          {user.name}
        </Text>

        <Text style={styles.profileRole}>
          CREW MEMBER
        </Text>


        <View
          style={[
            styles.profileCard,
            { backgroundColor: cardColor },
          ]}
        >

          <Text style={styles.profileLabel}>
            EMAIL
          </Text>

          <Text
            style={[
              styles.profileValue,
              { color: textColor },
            ]}
          >
            {user.email}
          </Text>


          <Text style={styles.profileLabel}>
            MOBILE NUMBER
          </Text>

          <Text
            style={[
              styles.profileValue,
              { color: textColor },
            ]}
          >
            {user.mobile}
          </Text>

        </View>


        <Pressable
          style={styles.mainButton}
          onPress={() =>
            Alert.alert(
              'Edit Profile',
              'Profile editing can be added here.'
            )
          }
        >
          <Text style={styles.mainButtonText}>
            EDIT PROFILE
          </Text>
        </Pressable>


        <Pressable
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.logoutText}>
            LEAVE THE OPERATION
          </Text>
        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
}


// ==================================================
// DASHBOARD
// ==================================================

function Dashboard({
  user,
  openProfile,
}) {

  const { theme } = useTheme();

  const { width } = useWindowDimensions();

  const background =
    theme === 'dark'
      ? BLACK
      : '#F4F1EA';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: background },
      ]}
    >

      <StatusBar
        style={
          theme === 'dark'
            ? 'light'
            : 'dark'
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal:
              width < 400 ? 18 : 24,
          },
        ]}
      >

        <Pressable onPress={openProfile}>
          <Header user={user} />
        </Pressable>

        <Balance />

        <QuickActions />

        <PromoCard />

        <Transactions />

      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor:
              theme === 'dark'
                ? '#111111'
                : WHITE,
          },
        ]}
      >

        <View style={styles.navItem}>

          <Text style={styles.navIcon}>
            ⌂
          </Text>

          <Text style={styles.navTextActive}>
            Home
          </Text>

        </View>

        <View style={styles.navItem}>

          <Text style={styles.navIcon}>
            ▥
          </Text>

          <Text style={styles.navText}>
            Insights
          </Text>

        </View>

        <View style={styles.navMiddle}>

          <Text style={styles.navMiddleIcon}>
            🎭
          </Text>

        </View>

        <View style={styles.navItem}>

          <Text style={styles.navIcon}>
            ▣
          </Text>

          <Text style={styles.navText}>
            Cards
          </Text>

        </View>

        <Pressable
          style={styles.navItem}
          onPress={openProfile}
        >

          <Text style={styles.navIcon}>
            ○
          </Text>

          <Text style={styles.navText}>
            Profile
          </Text>

        </Pressable>

      </View>

    </SafeAreaView>
  );
}


// ==================================================
// MAIN APP
// ==================================================

function MainApp() {

  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {

    checkSavedUser();

  }, []);


  const checkSavedUser = async () => {

    const saved =
      await AsyncStorage.getItem('user');

    // Saved user mil gaya toh login screen se start karenge
    if (saved) {
      setUser(JSON.parse(saved));
    }
  };


  const logout = async () => {

    setUser(null);
    setScreen('login');

  };


  if (screen === 'login') {

    return (
      <LoginScreen
        goToSignup={() =>
          setScreen('signup')
        }
        onLogin={(loggedUser) => {
          setUser(loggedUser);
          setScreen('dashboard');
        }}
      />
    );

  }


  if (screen === 'signup') {

    return (
      <SignupScreen
        goToLogin={() =>
          setScreen('login')
        }
        onSignup={(newUser) => {
          setUser(newUser);
          setScreen('dashboard');
        }}
      />
    );

  }


  if (screen === 'profile') {

    return (
      <ProfileScreen
        user={user}
        onBack={() =>
          setScreen('dashboard')
        }
        onLogout={logout}
      />
    );

  }


  return (
    <Dashboard
      user={user}
      openProfile={() =>
        setScreen('profile')
      }
    />
  );
}


// ==================================================
// APP + LOADING
// ==================================================

export default function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);

  }, []);


  if (loading) {
    return <LoadingScreen />;
  }


  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },


  // LOADING

  loadingScreen: {
    flex: 1,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingMask: {
    fontSize: 70,
    marginBottom: 20,
  },

  loadingTitle: {
    color: RED,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 2,
  },

  loadingSubtitle: {
    color: WHITE,
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 1,
  },

  loadingLine: {
    width: 100,
    height: 2,
    backgroundColor: RED,
    marginVertical: 25,
  },

  loadingText: {
    color: GREY,
    fontSize: 13,
  },

  loadingRedText: {
    color: RED,
    fontSize: 13,
    marginTop: 4,
  },


  // AUTH

  authContainer: {
    flex: 1,
    backgroundColor: BLACK,
  },

  authContent: {
    padding: 25,
    paddingBottom: 50,
    justifyContent: 'center',
  },

  authMask: {
    fontSize: 55,
    marginBottom: 12,
  },

  authTitle: {
    color: WHITE,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 1,
  },

  authSubtitle: {
    color: GREY,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },

  redLine: {
    width: 60,
    height: 3,
    backgroundColor: RED,
    marginVertical: 25,
  },

  inputLabel: {
    color: '#BBBBBB',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 7,
    marginTop: 14,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    backgroundColor: '#151515',
    color: WHITE,
    paddingHorizontal: 15,
    fontSize: 14,
  },

  inputError: {
    borderColor: RED,
  },

  errorText: {
    color: '#FF5A5F',
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },

  mainButton: {
    backgroundColor: RED,
    minHeight: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    paddingHorizontal: 15,
  },

  mainButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },

  switchText: {
    color: GREY,
    textAlign: 'center',
    marginTop: 25,
    fontSize: 12,
  },

  switchButton: {
    color: RED,
    textAlign: 'center',
    marginTop: 7,
    fontWeight: '800',
    fontSize: 13,
  },


  // IMAGE PICKER

  profilePicker: {
    width: 95,
    height: 95,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: RED,
    backgroundColor: '#171717',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 7,
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  cameraText: {
    fontSize: 28,
  },

  photoHint: {
    color: GREY,
    textAlign: 'center',
    fontSize: 11,
    marginBottom: 8,
  },


  // DASHBOARD HEADER

  scrollContent: {
    paddingTop: 20,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  headerSmall: {
    color: GREY,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },

  headerTitle: {
    color: RED,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 5,
  },

  initialCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: RED,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },

  initialText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '800',
  },


  // BALANCE

  balanceSection: {
    marginBottom: 25,
  },

  smallText: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
  },

  balance: {
    fontSize: 42,
    fontWeight: '800',
    marginTop: 5,
  },

  subBalance: {
    fontSize: 13,
    marginTop: 4,
  },


  // ACTIONS

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  actionButton: {
    alignItems: 'center',
    width: '23%',
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  actionSymbol: {
    color: WHITE,
    fontSize: 22,
    fontWeight: '700',
  },

  actionText: {
    color: GREY,
    fontSize: 11,
  },


  // PROMO CARD

  promoCard: {
    minHeight: 150,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#292929',
  },

  promoContent: {
    flex: 1,
  },

  promoTitle: {
    fontSize: 21,
    fontWeight: '800',
  },

  promoText: {
    fontSize: 13,
    marginTop: 7,
    marginBottom: 15,
  },

  inviteButton: {
    backgroundColor: RED,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 7,
  },

  inviteText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },

  promoMask: {
    fontSize: 55,
    marginLeft: 10,
  },


  // TRANSACTIONS

  transactionsSection: {
    marginBottom: 25,
  },

  sectionTitle: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },

  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },

  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },

  transactionSymbol: {
    color: WHITE,
    fontSize: 19,
    fontWeight: '700',
  },

  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },

  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  transactionDate: {
    fontSize: 11,
    marginTop: 3,
  },

  amount: {
    fontSize: 13,
    fontWeight: '700',
  },

  positive: {
    color: '#35B66F',
  },

  negative: {
    color: RED,
  },


  // PROFILE

  profileContent: {
    padding: 25,
    alignItems: 'center',
  },

  backButton: {
    color: RED,
    fontSize: 12,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginBottom: 30,
  },

  profileTitle: {
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 30,
  },

  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: RED,
    overflow: 'hidden',
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },

  largeProfileImage: {
    width: '100%',
    height: '100%',
  },

  initialProfile: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  largeInitial: {
    color: WHITE,
    fontSize: 45,
    fontWeight: '900',
  },

  profileName: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 15,
    textAlign: 'center',
  },

  profileRole: {
    color: RED,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 5,
  },

  profileCard: {
    width: '100%',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
  },

  profileLabel: {
    color: GREY,
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 8,
  },

  profileValue: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 15,
  },

  logoutButton: {
    marginTop: 15,
    padding: 15,
  },

  logoutText: {
    color: RED,
    fontWeight: '800',
    fontSize: 12,
  },


  // BOTTOM NAV

  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#292929',
  },

  navItem: {
    alignItems: 'center',
    width: '18%',
  },

  navIcon: {
    color: '#777777',
    fontSize: 20,
  },

  navText: {
    color: '#777777',
    fontSize: 10,
    marginTop: 3,
  },

  navTextActive: {
    color: RED,
    fontSize: 10,
    marginTop: 3,
    fontWeight: '700',
  },

  navMiddle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },

  navMiddleIcon: {
    fontSize: 27,
  },

});