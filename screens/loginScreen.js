import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
class loginScreen extends Component{
	constructor(props) {
        super(props);
		this.state={
			email:'',
			password:'',
			token: ''
		};
		//emailFromSignUp = this.props.navigation.getParam(email, '')
		
    }
	
	login(){
		
		const handleResponse = res => {
			if(res.status){
				return res.json()
			}
			throw new Error("fucking error")
		}
		
		return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
		{
			method: 'POST',
			headers:{
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password
			})
		})
		
		
		//.then((response) => response.json())
			/* .then((response) => {
				console.log(response)
			}) */
		
		.then((response) => {handleResponse()})
		
		.then((responseJson) => {
			console.log(responseJson)
		})
		
		
		
		/* .then((response) => {
			console.log("response: ", response)
			console.log("response status:", response.status)
			if (response.status == 400){
				Alert.alert("Couldn't find Account Matching these Details", "Please check email and password are correct")
			}
			else if(response.status == 200){
				//response = response.json()
				responseJson = response.json()
				console.log(responseJson)
				this.props.navigation.navigate('home')
			}
			else {
				Alert.alert("Unable to login, please try again later1")
			}
			
		}) */
		.catch((error) => {
			Alert.alert("Error" ,error.message)
		});
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
							onPress={() => this.props.navigation.navigate('signUp')}
							title="Sign Up"
						/>
					</View>
					<View style={styles.buttonContainer}>
						<Button
							color='palevioletred'
							onPress={() => this.props.navigation.navigate('home')}
							title="Back"
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