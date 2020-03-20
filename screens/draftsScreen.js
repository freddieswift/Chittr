import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, ActivityIndicator, Modal, Alert, TouchableOpacity, Button, AsyncStorage, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const _DRAFTSARRAY = 'drafts';
const _TOKEN = 'token';

//const ip = '192.168.0.28';
const ip = '10.0.2.2';

class draftsScreen extends Component{

	constructor(props){
		super(props);
		this.state ={
			draftsArray: [],
			token:'',
			location:''
		}
		
	}


	//initailse chitts array in storage - do in homescreen
	// on page load, get the drafts list



	componentDidMount(){
		this.getDraftsArray()
		this.getToken()
	}

	async getToken(){
		
		try{
			let token = await AsyncStorage.getItem(_TOKEN)
			if(token){
				this.setState({token: token})
			}
		}
		catch(error){
			console.log(error.message)
		}
		
	}

	async getDraftsArray(){
		try{
			let draftsArray = await AsyncStorage.getItem(_DRAFTSARRAY)
			draftsArray = JSON.parse(draftsArray)
			this.setState({draftsArray: draftsArray})
			this.setState({
					refresh: !this.state.refresh
				})
		}
		catch(error){
			console.log(error.message)
		}
	}

	findCoordinates(draft) {
		//console.log("finding coords")
		if(!this.state.locationPermission){
			this.state.locationPermission = this.requestLocationPermission();
		}
		Geolocation.getCurrentPosition(
			(position) => {
				const location = JSON.stringify(position);
				this.setState({location});
				//console.log("location",location)
					this.postChitt(draft);
				
				
			},
			
			(error) => {
				Alert.alert(error.message)
			},
			
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000
			}
			
			
		);
		
		
	}

	
	async requestLocationPermission(){
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					title: 'Chittr Location Permission',
					message: 'This app requires access to your location.',
					buttonNeutral: 'Ask Me Later',
					buttonMegative: 'Cancel',
					buttonPositive: 'OK',
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED){
				return true;
			}
			else{
				return false;
			}
		}
		catch(error){
			console.log(error.message);
		}
	}

	

	async postChitt(draft){
		try{
			console.log("posting chitt")
			const location = JSON.parse(this.state.location);
			const latitude = location.coords.latitude;
			const longitude = location.coords.longitude;
			const timestamp = location.timestamp;
			

			console.log(JSON.stringify({
					chit_id: 0,
					timestamp: timestamp,
					chit_content: draft.chit_content,
					location: {longitude: longitude, latitude: latitude},
					user: {
						email: this.state.email,
						password: this.state.password
					}
					
				}))


			const response = await fetch('http://' + ip + ':3333/api/v0.0.5/chits',
			{
				method: 'POST',
				headers:{
					"Content-Type": "application/json",
					"X-Authorization" : this.state.token
				},
				body: JSON.stringify({
					chit_id: 0,
					timestamp: timestamp,
					chit_content: draft.chit_content,
					location: {longitude: longitude, latitude: latitude},
					user: {
						email: this.state.email,
						password: this.state.password
					}
					
				})
			});
			
			const status = await response.status;
			
			if (status == 401){
				Alert.alert("Unable to Post chit")
			}
			
			else if (status == 201){
				Alert.alert("Successfully posted chitt")
			}
			
			
		}
		catch(error){
			Alert.alert("Unable to Post chit")
			console.log(error.message)
		}
		
		
	}

	render(){
		return(
			<View style={styles.container}>
				<View style={styles.headerBar}>
					<View style={styles.buttonContainer}>
						<Button
							title="Back "
							color='orchid'
							onPress={() => this.props.navigation.goBack()}
						/>
					</View>
					<Text style={styles.chittrHeaderText}>Chittr</Text>	
					<View style={styles.ghostButtonContainer}/>
				</View>
				<View style={styles.draftsList}>
					<FlatList
						data={this.state.draftsArray}
						renderItem={({item}) =>
							<TouchableOpacity onPress={() => this.findCoordinates(item)}>
								<View style={styles.chitt}>
									
										<Text style = {styles.chittText}>{item.chit_content}</Text>
									
								</View>
							</TouchableOpacity>
						}
						keyExtractor={({id}, index) => id}
						
					/>
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

	draftsList: {
		flex: 8,

	},

	chitt: {
		flexDirection: 'column',
		alignItems: 'stretch',
		margin: 5,
		padding: 5,
		borderColor: 'grey',
		borderWidth: 1,
		backgroundColor: 'white',
		borderRadius: 10,
	},

	chittText: {
		fontSize: 25,
		paddingLeft: 5
	},

	buttonContainer: {
		padding: 5,
	},
	
	ghostButtonContainer: {
		padding: 5,
		color: 'palevioletred',
		width: 55
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
    },

});

export default draftsScreen;

