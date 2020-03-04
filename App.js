import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
class chittr extends Component {
    constructor(props) {
        super(props);
		this.state = {
		  names: [
			 {'name': 'Ben', 'id': 1},
			 {'name': 'Susan', 'id': 2},
			 {'name': 'Robert', 'id': 3},
			 {'name': 'Mary', 'id': 4},
			 {'name': 'Daniel', 'id': 5},
			 {'name': 'Laura', 'id': 6},
			 {'name': 'John', 'id': 7},
			 {'name': 'Debra', 'id': 8},
			 {'name': 'Aron', 'id': 9},
			 {'name': 'Ann', 'id': 10},
			 {'name': 'Steve', 'id': 11},
			 {'name': 'Olivia', 'id': 12}
		  ]
	   }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerBar}>
                    <View style={styles.userPhoto}/>
                    <Text style={styles.chittrHeaderText}>Chittr</Text>
                    <View style={styles.userPhoto} />
                </View>
				<View style = {styles.chittList}>
					<FlatList
						data={this.state.names}
						renderItem={({item}) => 
							<View style={styles.chitt}>
								<Text style = {styles.chittText}>{item.name}</Text>
							</View>
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
	
	chitt: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 30,
		margin: 2,
		borderColor: 'black',
		borderWidth: 1,
		backgroundColor: 'white'
	},
	
	chittList: {
		flex: 8
	},

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
	
	chittText: {
		fontSize: 20
	},

    chittrHeaderText: {
        color: 'white',
        fontFamily: 'Courier New',
        fontSize: 30,
    },


});
export default chittr