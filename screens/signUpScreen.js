import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';


//const ip = '192.168.0.28';
const ip = '10.0.2.2';


class signUpScreen extends Component{
	constructor(props) {
        super(props);
		this.state={
			given_name:'',
			family_name:'',
			email:'',
			password:''
		};
    }
	

    // function to create a user account
	// uses the values in state to create a JSON string to send to the server
	// if unsuccessfull, user is prompted
	// if successfull, user taken to the login page
	createAccount(){
		return fetch('http://' + ip + ':3333/api/v0.0.5/user',
		{
			method: 'POST',
			headers:{
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				given_name: this.state.given_name,
				family_name: this.state.family_name,
				email: this.state.email,
				password: this.state.password
			})
		})
		.then((response) => {
			if (response.status == 400){
				Alert.alert("Unable to Create Account", "Please check if email is valid or for any missing fields")
			}
			else if(response.status == 201){
				Alert.alert("Successfully Created Account")
				this.props.navigation.navigate('login')
			}
			else {
				Alert.alert("Unable to Create Account")
			}
			
		})
		.catch((error) => {
			Alert.alert("Unable to Create Account")
		});
	}
	

	render(){
		return(
		
			<View style={styles.container}>
				<View style={styles.headerBar}>
					<Text style={styles.chittrHeaderText}>Chittr</Text>
				</View>
				
				<View style={styles.infoContainer}>
				
					
					<Text style={styles.info}>First Name</Text>
					<TextInput
						style={styles.inputField}
						onChangeText={(given_name) => this.setState({given_name})}
					/>
					
					
					<Text style={styles.info}>Surname</Text>
					<TextInput
						style={styles.inputField}
						onChangeText={(family_name) => this.setState({family_name})}
					/>
					
					
					<Text style={styles.info}>Email</Text>
					<TextInput
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
							onPress={() => this.createAccount()}
							title="Sign Up "
						/>
					</View>
					
					<View style={styles.buttonContainer}>
						<Button
							color='palevioletred'
							onPress={() => this.props.navigation.navigate('login')}
							title="Back "
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

export default signUpScreen;