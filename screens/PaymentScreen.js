import * as React from 'react';
import { Icon, Text, View } from '../components';
import { StyleSheet, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useConfirmPayment, CardField } from '@stripe/stripe-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';
import { Colors } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { KeyboardAvoidingView } from 'react-native';
import Constants from 'expo-constants';

export const PaymentScreen = () => {
  const { user } = React.useContext(AuthenticatedUserContext);
  const [plan, setPlan] = React.useState('0');
  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async (info) => {
    const response = await fetch(Constants.manifest.extra.paymentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: info.priceId,
        email: info.email,
        name: info.name,
      }),
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const handlePayPress = async () => {
    if (plan === '0') return;
    try {
      setIsLoading(true);
      const clientSecret = await fetchPaymentIntentClientSecret({
        email: user.email,
        priceId: plan,
        name: name,
      });

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        type: 'Card',
        billingDetails: {
          email: user.email,
        },
      });
      if (error) {
        Alert.alert('Failed', 'Payment did not succeed.');
      } else {
        Alert.alert('Success', `Payment succeeded! with id: ${paymentIntent.id}`);
      }

      setName('');
      setPlan('0');
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  return (
    <LinearGradient style={styles.container} colors={[Colors.mainFirst, Colors.mainSecond]}>
      <View isSafe={true} style={{ flex: 1 }}>
        <View style={styles.heading}>
          <Text bold={true} heading={true} style={{ fontSize: 22 }}>
            Enter your payment details
          </Text>
          <Text heading={true} style={{ fontSize: 18 }}>
            Please enter your card details. You will be only charged after 10 days and you can
            always cancel you subscription before that.
          </Text>
        </View>
        <View style={styles.form}>
          <KeyboardAvoidingView>
            <TextInput
              mode="outlined"
              placeholder="Name on card"
              value={name}
              onChangeText={(text) => setName(text)}
              outlineColor={Colors.black}
              activeOutlineColor={Colors.black}
              style={{ marginVertical: 16, backgroundColor: Colors.white }}
            />
            <RNPickerSelect
              name="plan"
              useNativeAndroidPickerStyle={false}
              Icon={() => <Icon name="chevron-down" size={24} color={Colors.black} />}
              items={[
                { label: '12 Months $259.99', value: 'price_1LT94EBgPqjmJlMVYhjs57x3', key: '1' },
                { label: '6 Months $139.99', value: 'price_1LT933BgPqjmJlMVzWcTKE1W', key: '2' },
                { label: '1 Month $24.99', value: 'price_1LT91PBgPqjmJlMVhayYqoev', key: '3' },
              ]}
              value={plan}
              placeholder={{ label: 'Select a Plan', value: '0' }}
              onValueChange={(value) => setPlan(value)}
              style={customPickerStyles}
            />
            <CardField
              postalCodeEnabled={false}
              autofocus
              style={styles.cardField}
              cardStyle={{
                backgroundColor: Colors.white,
                borderRadius: 8,
                color: Colors.black,
                borderColor: Colors.black,
                borderWidth: 1,
              }}
            />
            <Button
              mode="contained"
              labelStyle={{ color: Colors.white, fontSize: 16 }}
              style={{ borderColor: Colors.black }}
              color={Colors.secondary}
              onPress={handlePayPress}
              disabled={plan === '0' || isLoading || loading || name === ''}
            >
              Pay
            </Button>
          </KeyboardAvoidingView>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardField: {
    marginVertical: 16,
    height: 50,
  },
  heading: {
    marginBottom: 'auto',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
});

const customPickerStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: Colors.white,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 8,
    color: Colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    backgroundColor: Colors.white,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 8,
    color: Colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  placeholder: {
    color: Colors.black,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});
