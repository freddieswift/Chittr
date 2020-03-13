import React, { Component } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert, AsyncStorage } from 'react-native';

const _TOKEN = 'token';
const _ID = 'id';


class userProfile extends Component{
	constructor(props) {
        super(props);
		this.state={
			userDetails: [],
			token:'',
			id: '',
			followingList: []
		}
			
    }
	
	componentDidMount(){
		this.getUserDetails()
		this.getData()
	}
	
	
	//gets the list of followers for the currently logged in user
	async getFollowingList(){
		console.log("this.state.id",this.state.id)
		return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + "/following")
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("reponseJson", responseJson)
				this.state.followingList = responseJson
				//this.checkIfFollowing()
			})
			.catch((error) => {console.log("getfollowing list",error);})
	}
	
	async getUserDetails(){
		console.log("user id", this.props.navigation.state.params.user_id)
		return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.props.navigation.state.params.user_id)
			.then((response) => response.json())
			.then((responseJson) => {
				this.state.userDetails = responseJson
				this.setState({
					refresh: !this.state.refresh
				})
			})
			.catch((error) => {console.log(error);});
	}
	
	/* checkIfFollowing(){
		
		console.log("followingList",this.state.followingList)
		
		
		
		//var followingListObj = JSON.parse(this.state.followingList)
		for (var user in this.state.followingList){
			console.log(user.user_id)
			if (user.user_id == this.props.navigation.state.params.user_id){
				console.log("following")
				//return true;
			}
		}
		console.log("not following")
	} */
	
	async followUser(id){
		try{
			const token = this.state.token
			const response = await fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.props.navigation.state.params.user_id + "/follow",
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
		}
		catch(error){
			console.log(error.message)
		}
	}
	
	async getData(){
		try{
			let token = await AsyncStorage.getItem(_TOKEN)
			let id = await AsyncStorage.getItem(_ID)
			console.log("token is:", token)
			console.log("id is:", id)
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
		
		//this.checkIfFollowing()
		
		// check to see if the profile that is being loaded is the one for the logged in user
		// if it is not then display the option to follow the user displayed
		// should not be able to follow yourself
		// however this is allowed by the server
		
		let followButton;
		
		if (this.state.id != this.props.navigation.state.params.user_id){
			followButton = 
				<View style={styles.buttonContainer}>
					<Button 
						title="follow"
						color='palevioletred'
						onPress = {() => this.followUser(this.props.navigation.state.params.user_id)}
					/>
				</View>
			
		}
		
		const userDetails = this.state.userDetails;
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
					{followButton}
					<View style={styles.buttonContainer}>
						<Button 
							title="followers"
							color='palevioletred'
							onPress = {() => this.props.navigation.navigate('followers', {followingFollowers: "followers", user_id: this.props.navigation.state.params.user_id})}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<Button 
							title="following"
							color='palevioletred'
							onPress = {() => this.props.navigation.navigate('followers', {followingFollowers: "following", user_id: this.props.navigation.state.params.user_id})}
						/>
					</View>
					<View style={styles.chitList}>
						<FlatList
							data={userDetails.recent_chits}
							renderItem={({item}) => 
								<View style = {styles.result}>
									<Text style = {styles.chittText}>{item.chit_content}</Text>
								</View>
							}
							//keyExtractor={({id}, index) => id}
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
		
		backgroundColor: 'palevioletred',
		alignItems: 'center',
		margin: 5
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