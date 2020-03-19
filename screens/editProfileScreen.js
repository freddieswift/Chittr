import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, AsyncStorage } from 'react-native';

const ip = '192.168.0.28';
//const ip = '10.0.2.2';

const _TOKEN = 'token';
const _ID = 'id';

class editProfileScreen extends Component{
	constructor (props){
		super(props);
		this.state={
			userDetails: [],
			family_name:'',
			given_name:'',
			email:'',
			password:'',
			retypePassword:'',
			token: '',
			id:''
			
		}
	}
	
	componentDidMount(){
		
		this.state.userDetails = this.props.navigation.state.params.userDetails;
		this.state.given_name = this.props.navigation.state.params.userDetails.given_name;
		this.state.family_name = this.props.navigation.state.params.userDetails.family_name;
		this.state.email = this.props.navigation.state.params.userDetails.email;
		this.setState({
			refresh: !this.state.refresh
		});
		this.getData();
	}
	
	async getData(){
		try{
			let token = await AsyncStorage.getItem(_TOKEN)
			let id = await AsyncStorage.getItem(_ID)
			if(token){
				this.setState({token: token})
			}
			if(id){
				this.setState({id: id})
			}
			
		}
		catch(error){
			console.log(error.message)
		}
	}
	
	async updateUser(){
		if(this.state.password == this.state.retypePassword){
			try{
				const response = await fetch('http://' + ip + ':3333/api/v0.0.5/user/' + this.state.id,
				{
					method:'PATCH',
					headers:{
						"Content-Type": "application/json",
						"X-Authorization": this.state.token
					},
					body: JSON.stringify({
						given_name: this.state.given_name,
						family_name: this.state.family_name,
						email: this.state.email,
						password: this.state.password
					})
				});
				
				const status = await response.status;
				console.log(status)
				if (status == 201){
					Alert.alert("Successfully Updated Account")
					this.props.navigation.goBack()
				}
				else{
					Alert.alert("Couldnt update Account else")
				}
			
			
			}
		
		
			catch(error){
				Alert.alert("Couldnt update Account error")
				console.log(error.message)
			}
		}
		else{
			Alert.alert("Please Make Sure Passwords Match")
		}
		
	}
	
	
	
	
	render(){
		
		return(
			<View style={styles.container}>
				<View style={styles.headerBar}>
					<View style={styles.buttonContainer}>
						<Button
							color='orchid'
							title="Back "
							onPress={() => this.props.navigation.goBack()}
						/>
					</View>
					<Text style={styles.chittrHeaderText}>Chittr</Text>
					<View style={styles.buttonContainer}>
						<Button
							color='orchid'
							title="Save "
							onPress={() => this.updateUser()}
						/>
					</View>
				</View>
				<View style={styles.infoContainer}>
					<View style={styles.editDetailsHeader}>
						<Text style = {styles.userInfoText}>Edit Details</Text>
					</View>
					
					<Text style={styles.info}>First Name</Text>
					
					<TextInput
						style={styles.inputField}
						onChangeText={(given_name) => this.setState({given_name})}
						value={this.state.given_name}
					/>
					
					<Text style={styles.info}>Last Name</Text>
					
					<TextInput
						style={styles.inputField}
						onChangeText={(family_name) => this.setState({family_name})}
						value={this.state.family_name}
					/>
					
					<Text style={styles.info}>Email</Text>
					
					<TextInput
						style={styles.inputField}
						onChangeText={(email) => this.setState({email})}
						value={this.state.email}
					/>
					
					<Text style={styles.info}>Password</Text>
					
					<TextInput
						style={styles.inputField}
						onChangeText={(password) => this.setState({password})}
						secureTextEntry={true}
					/>
					
					<Text style={styles.info}>Re-type Password</Text>
					
					<TextInput
						style={styles.inputField}
						onChangeText={(retypePassword) => this.setState({retypePassword})}
						secureTextEntry={true}
					/>
					
				</View>
			</View>
			
			
		
		
		
		
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
        alignItems: 'stretch'
	},
	
	headerBar: {
		flex: 1,
        flexDirection: 'row',
        backgroundColor: 'palevioletred',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
	
	chittrHeaderText: {
        color: 'white',
        fontFamily: 'Courier New',
        fontSize: 30,
    },
	
	editDetailsHeader:{
		
		backgroundColor: 'palevioletred',
		alignItems: 'center',
		margin: 5
	},
	
	
	userInfoText:{
		fontSize: 30,
		color: 'white',
	},
	
	buttonContainer: {
		padding: 5,
		color: 'orchid',
	},
	
	inputField: {
		borderColor: 'gray',
		borderWidth: 1,
		margin: 5,
		paddingLeft: 10,
		fontSize: 20,
		borderRadius: 10,
	},
	
	info: {
		marginLeft: 5,
		padding: 5
		
	},
	
	infoContainer:{
		flex: 8,
	},
})

export default editProfileScreen;