import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
class loginScreen extends Component{
	constructor(props) {
        super(props);
		this.state={
			email:'',
			password:''
		};
		//emailFromSignUp = this.props.navigation.getParam(email, '')
		
    }
	
	login(){
		Alert.alert(
			this.state.email,
			this.state.password,
			[{text: 'OK', onPress: () => console.log('OK Pressed')}]
		)
	}

	render(){
		return(
			<View style={styles.container}>
				<View style={styles.headerBar}>
					<Text style={styles.chittrHeaderText}>Chittr</Text>
				</View>
				
				<View style={styles.infoContainer}>
					<Text style={styles.info}>Email</Text>
					<TextInput
						value={this.state.email}
						style={styles.inputField}
						onChangeText={(email) => this.setState({email})}
					/>
					<Text style={styles.info}>Password</Text>
					<TextInput
						style={styles.inputField}
						secureTextEntry={true}
						onChangeText={(password) => this.setState({password})}
					/>
					
					<View style={styles.buttonContainer}>
						<Button
						color='palevioletred'
							onPress={() => this.login()}
							title="Login"
						/>
					</View>
					<View style={styles.buttonContainer}>
						<Button
							color='palevioletred'
							onPress={() => this.props.navigation.navigate('home')}
							title="Back"
						/>
					</View>
					<View style={styles.buttonContainer}>
						<Button
							color='palevioletred'
							onPress={() => this.props.navigation.navigate('signUp')}
							title="Sign Up"
						/>
					</View>
				</View>	
					
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		
	},
	
	buttonContainer: {
		padding: 5,
	},
	
	inputField: {
		borderColor: 'gray',
		borderWidth: 1,
		margin: 5
	},
	
	info: {
		marginLeft: 5,
		padding: 5
		
	},
	
	infoContainer:{
		flex: 8
	},
	
	chittrHeaderText: {
        color: 'white',
        fontFamily: 'Courier New',
        fontSize: 30,
    },
	
	headerBar: {
		flex: 1,
        flexDirection: 'row',
        backgroundColor: 'palevioletred',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default loginScreen;