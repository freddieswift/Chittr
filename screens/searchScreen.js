import React, { Component } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';

const _TOKEN = 'token';

//const ip = '192.168.0.28';
const ip = '10.0.2.2';

class searchScreen extends Component{
	constructor(props) {
        super(props);
		this.state={
			query:'',
			result:[]
		};
    }
	

	// function to search for a user
	// uses the query entered by the user in the box to search
	// stores the result in state so it can the be rendered in the flat list
	search(){
		return fetch('http://' + ip + ':3333/api/v0.0.5/search_user?q=' + this.state.query)
			.then((response) => response.json())
			.then((responseJson) => {
				this.state.result = responseJson
				this.setState({
					refresh: !this.state.refresh
				})
				console.log("result", this.state.result)
			})
			
			.catch((error) => {console.log("errorrorororr", error);});
			
	}
	
	render(){
		
		const result = this.state.result;
		
		return (
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
				<View style={styles.infoContainer}>
					<TextInput
						style={styles.inputField}

						onChangeText={(query) => this.setState({query})}
						placeholder='Search'
					/>
					<View style={styles.buttonContainer}>
						<Button
							title="Search "
							color='orchid'
							onPress={() => this.search()}
						/>
					</View>
					<View style = {styles.resultList}>
						<FlatList
							data={result}
							extraData={this.state.refresh}
							renderItem={({item}) => 
								<TouchableOpacity onPress={() => this.props.navigation.navigate('userProfile', {user_id: item.user_id})}>
									<View style={styles.result}>
										<View >
											<Text style = {styles.userInfoText}>{item.given_name + " " + item.family_name}</Text>
										</View>
									</View>
								</TouchableOpacity>
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
	
	resultList: {
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
	
	userInfoText: {
		fontSize: 15,
		paddingLeft: 5
	},
	
	chittrHeaderText: {
        color: 'white',
        fontFamily: 'Courier New',
        fontSize: 30,
    },
	
	infoContainer:{
		flex: 8,
	},
	
	buttonContainer: {
		padding: 5,
	},
	
	ghostButtonContainer: {
		padding: 5,
		color: 'palevioletred',
		width: 55
	},
	
	inputField: {
		borderColor: 'gray',
		borderWidth: 1,
		margin: 5,
		paddingLeft: 10,
		fontSize: 20
	}
	
	
});

export default searchScreen;