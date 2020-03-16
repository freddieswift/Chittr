import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, AsyncStorage } from 'react-native';

class editProfileScreen extends Component{
	constructor (props){
		super(props);
		this.state={
			userDetails: []
		}
	}
	
	componentDidMount(){
		this.setState({userDetails: this.props.navigation.state.params.userDetails})
		console.log(this.state)
	}
	
	
	render(){
		return(
			<View>
			<Text>hello</Text>
			</View>
		
		
		
		
		)
	}
}

export default editProfileScreen;