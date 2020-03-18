import React, { Component } from 'react';
import { RNCamera } from 'react-native-camera';

class cameraScreen extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<RNCamera
				ref={ref => {
					this.camera=ref;
				}}
				style = {{flex: 1, width:'100%',}}
			>
			</RNCamera>
		);
	}
}



export default cameraScreen;