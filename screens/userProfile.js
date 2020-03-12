import React, { Component } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert, AsyncStorage } from 'react-native';

const _TOKEN = 'token';

class userProfile extends Component{
	constructor(props) {
        super(props);
		this.state={
			userDetails: []
		}
			
    }
	
	componentDidMount(){
		this.getUserDetails()
	}
	
	async getUserDetails(){
		return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.props.navigation.state.params.user_id)
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("rj", responseJson)
				this.state.userDetails = responseJson
				
				console.log("ud", this.state.userDetails)
				console.log("famname",this.state.userDetails.family_name)
				this.setState({
					refresh: !this.state.refresh
				})
			})
			.catch((error) => {console.log(error);});
	}
	
	render(){
		
		console.log("render fam name", this.state.userDetails.family_name)
		return(
			<View style = {styles.container}>
				<View style={styles.headerBar}>
					<View style={styles.buttonContainer}>
						<Button
							title="Back"
							onPress={() => this.props.navigation.goBack()}
						/>
					</View>
					<Text style={styles.chittrHeaderText}>Chittr</Text>
					<View style={styles.ghostButtonContainer}/>
				</View>
				<View style={styles.infoContainer}>
					<View style={styles.userInfoContainer}>
						<Text style = {styles.userInfoText}>{this.state.userDetails.given_name + " " + this.state.userDetails.family_name}</Text>
					</View>
					<View style={styles.chitList}>
						
					</View>
				</View>
			</View>
		);
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
	
	buttonContainer: {
		padding: 5,
	},
	
	ghostButtonContainer: {
		padding: 5,
		color: 'palevioletred',
		width: 55
	},
	
	infoContainer:{
		flex: 8,
	},
	
	userInfoContainer:{
		flex: 1,
		backgroundColor: 'palevioletred',
		alignItems: 'center',
		margin: 3
	},
	
	chitList:{
		flex: 10
	},
	
	userInfoText:{
		fontSize: 30,
		color: 'white',
	}
	
	
});

export default userProfile;