import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
class loginScreen extends Component{
	constructor(props) {
        super(props);
    }
	render(){
		return(
		<View>
			<View>
				<Text>hello</Text>
			</View>
			<View>
				<Button
					onPress={() => this.props.navigation.navigate('home')}
					title="Press"
				/>
			</View>
		</View>
		);
	}
}

export default loginScreen;