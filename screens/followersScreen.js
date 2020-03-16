import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, AsyncStorage } from 'react-native';

class followersScreen extends Component{
	constructor(props){
		super(props);
		this.state={
			list: []
		}
	}
	
	componentDidMount(){
		this.getList();
		const {navigation} = this.props;
		navigation.addListener ('willFocus', () => {
			this.getList();
		});
	}
	
	async getList(){
		//this.props....user_id = the id of the user logged in
		return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.props.navigation.state.params.user_id + "/" + this.props.navigation.state.params.followingFollowers)
			.then((response) => response.json())
			.then((responseJson) => {
				this.state.list = responseJson
				this.setState({
					refresh: !this.state.refresh
				})
			})
			.catch((error) => {console.log(error);})
	}
	
	
	render(){
		const list = this.state.list;
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
				<View style={styles.list}>
					<FlatList
						data={list}
						renderItem={({item}) => 
							<TouchableOpacity onPress={() => this.props.navigation.push('userProfile', {user_id: item.user_id})}>
								<View style = {styles.result}>
									<Text style = {styles.resultText}>{item.given_name + " " + item.family_name}</Text>
								</View>
							</TouchableOpacity>
						}
						keyExtractor={item=>item.id}
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
	
	list: {
		flex: 8
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
	
	resultText: {
		fontSize: 25,
		paddingLeft: 5
	},
	
	ghostButtonContainer: {
		padding: 5,
		color: 'palevioletred',
		width: 55
	},
	
	buttonContainer: {
		padding: 5,
	},
})
export default followersScreen;