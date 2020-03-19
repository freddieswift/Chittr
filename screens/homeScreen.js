import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, ActivityIndicator, Modal, Alert, TouchableOpacity, Button, AsyncStorage, PermissionsAndroid } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Geolocation from 'react-native-geolocation-service';

const ip = '192.168.0.28';
//const ip = '10.0.2.2';

const _TOKEN = 'token';
const _ID = 'id';

class homeScreen extends Component {
	_isMounted = false;
	_menu = null;
	
	setMenuRef = ref => {
		this._menu = ref;
	};
	
	hideMenu = () => {
		this._menu.hide();
	};
	
	showMenu = () => {
		this._menu.show();
	};
	
	logoutOption = () => {
		this.logoutCall();
		this._menu.hide();
		
	};
	
	myAccount = () => {
		this.props.navigation.navigate('userProfile', {user_id: this.state.id});
		
		this._menu.hide();
	}
	
	
	
    constructor(props) {
        super(props);
		this.state = {
		  isLoading: true,
		  chitsData: [],
		  token: '',
		  loggedIn: false,
		  id: '',
		  modalOpen: false,
		  setModalOpen: false,
		  chitt: '',
		  location: null,
		  locationPermission: false
	   }
	   
	   
	   
    } 
	
	componentDidMount(){
		this._isMounted = true;
		this.getChits();
		this.getToken();
		this.getID();
		
		//this.findCoordinates();
		
		const {navigation} = this.props;
		navigation.addListener ('willFocus', () => {
			this.getToken();
			this.getID();

			//this.getChits();
		});
	}
	
	componentWillUnmount(){
		this._isMounted = false;
	}
	
	findCoordinates() {
		//console.log("finding coords")
		if(!this.state.locationPermission){
			this.state.locationPermission = this.requestLocationPermission();
		}
		Geolocation.getCurrentPosition(
			(position) => {
				const location = JSON.stringify(position);
				this.setState({location});
				console.log("location",location)
				this.postChitt();
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
				//console.log('You can access location');
				return true;
			}
			else{
				//console.log('Location Permission Denied');
				return false;
			}
		}
		catch(error){
			console.log(error.message);
		}
	}
	
	getChits(){
		let headers;
		//console.log("logged in", this.state.loggedIn)
		if (this.state.loggedIn == true){
			headers = {headers: {"X-Authorization" : this.state.token}}
		}
		else{
			headers = {}
		}
		//console.log(headers) 
		return fetch('http://' + ip + ':3333/api/v0.0.5/chits', headers)
		
			.then((response) => response.json())
			.then((responseJson) => {
				if (this._isMounted){
					this.setState({
					isLoading: false,
					chitsData: responseJson,
					});
				}
				
			})
			.catch((error) => {console.log(error);});
	}
	
	async getID(){
		if (this._isMounted){
			try{
				let id = await AsyncStorage.getItem(_ID)
				if(id){
					this.setState({id: id})
				}
			}
			catch(error){
				console.log(error.message)
			}
		}
	}
	
	async getToken(){
		if (this._isMounted){
			try{
				let token = await AsyncStorage.getItem(_TOKEN)
				if(token){
					this.setState({token: token})
					this.setState({loggedIn: true});
				}
				else{
					this.setState({loggedIn: false});
				}
				this.getChits();
			}
			catch(error){
				console.log(error.message)
			}
		}
	}
	
	async deleteData(){
		try{
			await AsyncStorage.removeItem(_TOKEN)
			await AsyncStorage.removeItem(_ID)
			this.setState({loggedIn: false});
		}
		catch(error){
			console.log(error.message)
		}
		this.getChits();
	}
	
	async postChitt(){
		try{
			const location = JSON.parse(this.state.location);
			const latitude = location.coords.latitude;
			const longitude = location.coords.longitude;
			const timestamp = location.timestamp;
			
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
					chit_content: this.state.chitt,
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
				this.getChits();
				this.setState({modalOpen: false})
			}
			
			
		}
		catch(error){
			Alert.alert("Unable to Post chit")
			console.log(error.message)
		}
		
		
	}
	
	async logoutCall(){
		try{
			const response = await fetch('http://' + ip + ':3333/api/v0.0.5/logout',
			{
				method: 'POST',
				headers:{
					"Content-Type": "application/json",
					"X-Authorization" : this.state.token
				},
			});
			
			const status = await response.status;
			
			if (status == 400){
				Alert.alert('Unable To Logout','Please try again')
			}
			
			else if (status == 200){
				this.deleteData();
				
			}
			
			else {
				Alert.alert("Unable to logout, please try again")
			}
		}
		catch(error){
			console.log(error)
		}
		
		
		
	}
	
    render() {
		
		const loggedIn = this.state.loggedIn;
		
		let loginOptionsButton;
		
		let fab;
		
		if (loggedIn){
			
			fab = 
				<TouchableOpacity style={styles.fab} onPress={() => {this.setState({modalOpen: true})}}>
					<Text style={styles.fabText}>+</Text>
				</TouchableOpacity>
			
			loginOptionsButton = 
				<View>
					<Menu
						ref={this.setMenuRef}
						button ={<Button title="Options " color='orchid' onPress={this.showMenu}></Button>}
					>
						<MenuItem onPress={this.logoutOption}>Log Out</MenuItem>
						<MenuItem onPress={this.myAccount}>My Account</MenuItem>
					</Menu>
				</View>
		}
		else{
			loginOptionsButton = <Button
				onPress={() => this.props.navigation.navigate('login')}
				title="Login "
				color='orchid'
				>
				
			</Button>
		}
		
		if(this.state.isLoading){
			return(
				<View>
					<ActivityIndicator/>
				</View>
			)
		}
		
        return (
            <View style={styles.container}>
			
				<Modal visible={this.state.modalOpen} animationType='slide' transparent={true}>
					<View style={styles.modal}>
						<View style={styles.modalContent}>
							<View style={styles.inputField}>
								<TextInput
									numberOfLines={3}
									onChangeText={(chitt) => this.setState({chitt})}
									placeholder='Type Something Creative...'
									maxLength= {141}
									multiline={true}
									fontSize= {20}
								/>
							</View>
							<View style={styles.button}>
								<Button style={styles.button}
									title="Post"
									color='orchid'
									onPress={ () => this.findCoordinates()}
								/>
							</View>
							
							<View style={styles.button}>
								<Button
									title="Back"
									color='orchid'
									onPress={ () => {this.setState({modalOpen: false})}}
								/>
							</View>	
							
						
						</View>
					</View>
				</Modal>
				
				
                <View style={styles.headerBar}>
					<View>
						{loginOptionsButton}
					</View>
					<Text style={styles.chittrHeaderText}>Chittr</Text>	
					<View>
						<Button
							title="Search "
							color='orchid'
							onPress={ () => this.props.navigation.navigate('search')}
						/>
					</View>
					
				</View>
				<View style = {styles.chittList}>
					<FlatList
						data={this.state.chitsData}
						showsVerticalScrollIndicator={false}
						renderItem={({item}) => 
							<View style={styles.chitt}>
								<View >
									<Text style = {styles.userInfoText}>{item.user.given_name + " " + item.user.family_name}</Text>
								</View>
								<View>
									<Text style = {styles.chittText}>{item.chit_content}</Text>
								</View>
								
							</View>
						} 
						keyExtractor={({id}, index) => id}
						//keyExtractor={item=>item.id}
					/>
				</View>
								
				{fab}
            </View>
        );
    }	
}
const styles = StyleSheet.create({
	//holds the whole page
    container: {
		flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
	
	menuButton: {
		backgroundColor: 'blue'
	},
	
	modal:{
		flex: 1,
		justifyContent: 'center'
	},
	
	inputField: {
		//TO FIX: STOP TEXT INPUT MOVING UPWARDS WHEN TYPING
		justifyContent: 'flex-start',
		borderColor: 'gray',
		borderWidth: 1,
		margin: 5,
		paddingLeft: 10,
		borderRadius: 10,
		height: 150
	},
	
	button:{
		margin: 5
	},
	
	modalContent:{
		
		backgroundColor: 'white',
		padding: 10,
		margin: 30,
		borderColor: 'grey',
		borderWidth: 1,
		borderRadius: 10,
	},
	
	//the whole chit
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
	
	// flatlist to hold chitts
	chittList: {
		flex: 8
	},

	// header at top of screen
    headerBar: {
		flex: 1,
        flexDirection: 'row',
        backgroundColor: 'palevioletred',
        alignItems: 'center',
        justifyContent: 'space-around'
       
    },

    userPhoto: {
        height: 20,
        width: 20,
        backgroundColor: 'white',
        
    },
	
	userInfoText: {
		fontSize: 15,
		paddingLeft: 5
	},
	
	fab:{
		width: 60,
		height: 60,
		backgroundColor: 'palevioletred',
		position: 'absolute',
		bottom: 15,
		right: 15,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	
	fabText: {
		fontSize: 40,
		color: 'white',
		marginBottom: 5
	},
	
	//chit content text
	chittText: {
		fontSize: 25,
		paddingLeft: 5
	},

    chittrHeaderText: {
        color: 'white',
        fontFamily: 'Courier New',
        fontSize: 30,
    },


});
export default homeScreen;
