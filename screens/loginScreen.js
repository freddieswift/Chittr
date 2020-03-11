import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, AsyncStorage } from 'react-native';

const _TOKEN = 'token';

class loginScreen extends Component{
	
	
	constructor(props) {
        super(props);
		this.state={
			email:'',
			password:'',
		};
    }
	
	
	
	async storeToken(token){
		try{
			await AsyncStorage.setItem(_TOKEN, token);
			this.getToken();
		}
		catch(error){
			console.log("something went wrong", error.Message)
		}
	}
	
	
	
	async getToken(){
		try{
			let token = await AsyncStorage.getItem(_TOKEN)
			console.log("token is:", token)
		}
		catch(error){
			console.log("something went wrong", error.Message)
		}
	}
	
	
	
		
	async login(){
		try{
			const response = await fetch("http://10.0.2.2:3333/api/v0.0.5/login",
			{
				method: 'POST',
				headers:{
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password
				})
			});
			
			const status = await response.status;
			
			
			//check if response status is ok before proceeding
			if (status == 400){
				Alert.alert("Couldn't find Account Matching these Details", "Please check email and password are correct")
			}
			
			
			
			else if(status == 200){
				// get token  from response
				const json = await response.json();
				this.storeToken(json.token)
				this.props.navigation.goBack()
			}
			
			
			else {
				Alert.alert("Unable to login, please try again later1")
			}
			
			
			
		} catch (error) {
			console.log(error)
		}
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
							onPress={() => this.props.navigation.goBack()}
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
		margin: 5,
		paddingLeft: 10,
		fontSize: 20
	},
	
	info: {
		fontSize: 20,
		marginLeft: 5,
		padding: 5,
		
		
	},
	
	infoContainer:{
		flex: 8,
		
		justifyContent: 'center'
		
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