import React, { Component } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Alert, AsyncStorage } from 'react-native';
import { RNCamera } from 'react-native-camera';

const _TOKEN = 'token';
const _ID = 'id';

//const ip = '192.168.0.28';
const ip = '10.0.2.2';

class userProfile extends Component{
	constructor(props) {
        super(props);
		this.state={
			userDetails: [],
			token:'',
			id: '',
			followingList: [],
			following: false,
			modalOpen: false,
			userImage: '...',
			imageHash: Date.now()
		}
			
    }
	

	//called when the page first loads
	//gets the neccessary data so the right components can be loaded
	componentDidMount(){
		this.getUserDetails()
		this.getData()
		

		//willFocus listener means everytime to page comes back into focus, the details can be reloaded
		// userful for when the user is on the edit details page and presses back, so the updated details will be displayed
		const {navigation} = this.props;
		navigation.addListener ('willFocus', () => {
			this.getUserDetails()
			
		});
	}
	
	
	//gets the list of followers for the currently logged in user
	// sets following to be true or false so that the follow/unfollow button can be updated
	async getFollowingList(){
		return fetch('http://' + ip + ':3333/api/v0.0.5/user/' + this.state.id + "/following")
			.then((response) => response.json())
			.then((responseJson) => {
				this.state.followingList = responseJson
				const followingBool = this.checkIfFollowing()
				
				if(followingBool == true){
					this.setState({
						following: true
					})
				}
				else{
					this.setState({
						following: false
					})

				}
				this.setState({
					refresh: !this.state.refresh
				})
			})
			.catch((error) => {console.log("getfollowing list",error);})
	}
	

	//function to get the current user's details to display on screen
	// uses the id passed in when clicking on the user in the list on the previous screen
	// the profile picture is also loaded
	async getUserDetails(){
		return fetch('http://' + ip + ':3333/api/v0.0.5/user/' + this.props.navigation.state.params.user_id)
			.then((response) => response.json())
			.then((responseJson) => {
				this.state.userDetails = responseJson
				this.setState({
					refresh: !this.state.refresh
				})
				this.loadImage()
			})
			.catch((error) => {console.log(error);});
	}


	//function to load the profile picture of the user who's profile it is
	// + Date.now() used to get the app to contact the server again,
	//without this the app seemed to use a cached version of the image. A different
	// uri for the image meant when the image was re rendered it would actually contact the server. 
	//Date.now() as a paraemter on the end does not affect the query to the server
	// seems a bit hacky but couldnt find another solution, however the image doe take a while to load
	// this reloads the image because the image component relies in this.state.userImage
	// so when this.state.userImage is changed, the Image component reloads
	loadImage(){
		this.setState({userImage: 'http://' + ip + ':3333/api/v0.0.5/user/' + this.props.navigation.state.params.user_id + '/photo?time=' + Date.now()})
	}
	

	//function to unfollow user
	//uses the user id passed in during the navigation
	//reloads the user's following list so the button can be updated to follow
	async unFollowUser(id){
		return fetch('http://' + ip + ':3333/api/v0.0.5/user/' + this.props.navigation.state.params.user_id + "/follow",
			{
				method:'delete',
				headers:{
					"Content-Type": "application/json",
					"X-Authorization": this.state.token
				},
			}
		)
		.then((response) => {
			const status = response.status
			if (status == 200){
				Alert.alert("Successfully unfollowed user")
			}
			else if (status == 401){
				Alert.alert("Unable to Unfollow User")
			}
			else if (status == 404){
				Alert.alert("Unable to Unfollow User")
			}
			this.getFollowingList()
		})
		.catch((error) => {
			console.log(error);
		});
	}
	
	checkIfFollowing(){
		for (var i in this.state.followingList){
			if (this.state.followingList[i].user_id == this.props.navigation.state.params.user_id){
				return true;
			}
		}
		return false;
	}
	

	//function to follow a user
	//uses the id of the user passed during the navigation to the profile
	//then reloads the users following list so the button can be updated to unfollow
	async followUser(id){
		try{
			const token = this.state.token
			const response = await fetch('http://' + ip + ':3333/api/v0.0.5/user/' + this.props.navigation.state.params.user_id + '/follow',
			{
				method: 'POST',
				headers:{
					"Content-Type": "application/json",
					"X-Authorization": token
				},
			});


			
			const status = await response.status;
			
			if(status == 401){
				Alert.alert("Please login to follow this user")
			}
			else if (status == 200){
				Alert.alert("Successfully followed user")
			}
			else{
				Alert.alert("Unable to follow user, please try again later")
			}
			this.getFollowingList()
			
		}
		catch(error){
			console.log(error.message)
		}
	}



	// function to take a picture and send it to the server
	// sends the data captured from RNCamera
	// if successful, then the camera is closed and the profile picture is reloaded
	async takePicture(){

		if (this.camera){
			const options = {quality:0.5, base64:true}
			const data = await this.camera.takePictureAsync(options);

			try{
				const response = await fetch('http://' + ip + ':3333/api/v0.0.5/user/photo',
				{
					method: 'POST',
					headers:{
						"Content-Type": "image/jpeg",
						"X-Authorization": this.state.token
					},
					body: data
				});

				const status = response.status;

				if (status == 201){
					Alert.alert("Successfully Updated Photo")
					this.loadImage()
					this.setState({modalOpen: false})
				}
				else{
					Alert.alert("Unable to Update Photo")
				}
			}
			catch(error){
				console.log("updatuing photo error", error.message)
			}
		}

		
	}

	// async getPicture(){
	// 	try{
	// 		const response = await fetch('http://' + ip + ':3333/api/v0.0.5/user/' + this.state.id + '/photo',{
	// 			method: 'GET'
	// 		});

	// 		const status = response.status;

	// 		if(status == 200){
	// 			this.state.userImage = response.url;
	// 		}
	// 		else{
	// 			console.log("unable to get user profile image1");
	// 		}

	// 		console.log("getPictre", this.state.userImage)
	// 		this.setState({
	// 				refresh: !this.state.refresh
	// 			})

	// 	}
	// 	catch(error){
	// 		console.log("unable to get user profile image2", error.message);
	// 	}
	// }
	

	//function to get the id and token of the logged in user from async storage
	//sets these values in state
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
			this.getFollowingList()
			
		}
		catch(error){
			console.log(error.message)
		}
	}

	
	render(){


		// check to see if the profile that is being loaded is the one for the logged in user
		// if it is not then display the option to follow or unfollow the user displayed
		// should not be able to follow yourself
		// edit button will be displayed if it is the logged in user's profile
		// however this is allowed by the server
		
		let followButton;
		let editFollowUnfollowButton;
		let profilePicture;
		if (this.state.id != this.props.navigation.state.params.user_id){
			// if not current user's profile, do not allow user to click on profile picture to change it
			// no onPress prop
			profilePicture = 
				<Image
					style={styles.image}
					source={{uri: this.state.userImage}}
				/>
		
			// if current user is not following the user who's profile is displayed
			// set button to show follow
			// clicking button will the follow said user
			if (this.state.following == false){
				editFollowUnfollowButton = 
				<View style={styles.buttonContainer}>
					<Button 
						color='orchid'
						title="follow"
						
						onPress = {() => this.followUser(this.props.navigation.state.params.user_id)}
					/>
				</View>
			}
			

			//if current user is following the user who's profile is displayed
			// set the button to show unfollow
			//clikcing button will unfollow that user
			else {
				editFollowUnfollowButton = 
				<View style={styles.buttonContainer}>
					<Button 
						color='orchid'
						title="unfollow"
						
						onPress = {() => this.unFollowUser(this.props.navigation.state.params.user_id)}
					/>
				</View>
			}
			
			
		}
		// if profile is current user's, allow user to click on profile picture,
		// which will open the camera to change the picture
		else{
			profilePicture = 
				<TouchableOpacity onPress={() => this.setState({modalOpen: true})}>
					<Image
						style={styles.image}
						source={{uri: this.state.userImage}}
					/>
				</TouchableOpacity>

			//if profile is current user's, show edit button which will take the user to
			// the edit profile screen
			// pass the details of the user so they can be pre loaded into the input fields
			editFollowUnfollowButton = 
				<View style = {styles.buttonContainer}>
					<Button 
						color='orchid'
						title="Edit "
						onPress = {() => this.props.navigation.navigate('editProfile', {userDetails: this.state.userDetails, user_id: this.props.navigation.state.params.user_id})}
					/>
				</View>
		}
		
		const userDetails = this.state.userDetails;
		return(
			<View style = {styles.container}>
				<Modal visible={this.state.modalOpen} animationType='slide'>
				
					<RNCamera
						ref={ref => {
							this.camera=ref;
						}}
						style = {{flex: 1, width:'100%',}}
					>
					</RNCamera>
				

					<View style={styles.buttonContainer}>
						<Button
							title="Take Image "
							color='orchid'
							onPress={ () => {this.takePicture()}}
						/>
					</View>

					<View style={styles.buttonContainer}>
						<Button
							title="Back "
							color='orchid'
							onPress={ () => {this.setState({modalOpen: false})}}
						/>
					</View>	
	

				</Modal>
				<View style={styles.headerBar}>
					<View style={styles.buttonContainer}>
						<Button
							color='orchid'
							title="Back "
							onPress={() => this.props.navigation.goBack()}
						/>
					</View>
					<Text style={styles.chittrHeaderText}>Chittr</Text>
					{editFollowUnfollowButton}
				</View>

				<View style={styles.imageContainer}>
					{profilePicture }
				</View>

				<View style={styles.userInfoContainer}>
						<Text style = {styles.userInfoText}>{this.state.userDetails.given_name + " " + this.state.userDetails.family_name}</Text>
				</View>

				<View style={styles.followContainer}>
					<View style={styles.followingFollowersButtonContainer}>
						<Button 
							title="Followers "
							color='orchid'
							onPress = {() => this.props.navigation.navigate('followers', {followingFollowers: "followers", user_id: this.props.navigation.state.params.user_id})}
						/>
					</View>
					<View style={styles.followingFollowersButtonContainer}>
						<Button 
							title="Following "
							color='orchid'
							onPress = {() => this.props.navigation.navigate('followers', {followingFollowers: "following", user_id: this.props.navigation.state.params.user_id})}
						/>
					</View>
				</View>

				<View style={styles.infoContainer}>
					<View style={styles.chitList}>
						<FlatList
							data={userDetails.recent_chits}
							renderItem={({item}) => 
								<View style = {styles.result}>
									<Text style = {styles.chittText}>{item.chit_content}</Text>
								</View>
							}
							keyExtractor={item=>item.id}
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

    cameraButtonContainer: {
		padding: 5,
		position : 'absolute'
	},
	
	
	followingFollowersButtonContainer:{
		flex: 1,
		padding: 5
	},
	
	buttonContainer: {
		
		padding: 5,
		backgroundColor: 'transparent',

	},

	followContainer: {
		flex: 0.7,
		flexDirection: 'row',
		
		justifyContent: 'space-between'
	},


	
	infoContainer: {
		flex: 5,
	},

	imageContainer: {
		flex: 2,
		backgroundColor: 'palevioletred',
		margin: 5,
		marginBottom: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},

	image: {
		width: 115,
		height: 115
	},
	
	userInfoContainer: {
		flex: 1,
		backgroundColor: 'palevioletred',
		alignItems: 'center',
		margin: 5,
		marginTop:0
	},
	
	chitList:{
		flex: 10
	},
	
	userInfoText:{
		fontSize: 30,
		color: 'white',
	},
	
	chittText:{
		fontSize: 25,
		paddingLeft: 5
	},
	
	result: {
		flexDirection: 'column',
		alignItems: 'stretch',
		margin: 5,
		padding: 5,
		borderColor: 'grey',
		borderWidth: 1,
		backgroundColor: 'white'
	},
	
	
});

export default userProfile;