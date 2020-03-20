import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, ActivityIndicator, Modal, Alert, TouchableOpacity, Button, AsyncStorage, PermissionsAndroid } from 'react-native';

const _DRAFTSARRAY = 'drafts';

class draftsScreen extends Component{

	constructor(props){
		super(props);
		this.state ={draftsArray: []}
		
	}


	//initailse chitts array in storage - do in homescreen
	// on page load, get the drafts list



	componentDidMount(){
		this.getDraftsArray()

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
							<View style={styles.chitt}>
								<View>
									<Text style = {styles.chittText}>{item.chit_content}</Text>
								</View>
							</View>
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

