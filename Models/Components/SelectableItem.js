import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

class SelectableItem extends Component{
    constructor(props){
        super(props)
        this.state={
            isSelected:this.props.initialState,
        }

        this.selectItem = this.selectItem.bind(this);
    }

    async selectItem(){
        await this.setState({isSelected:!this.state.isSelected});
        this.props.logItem(this.props.name, this.state.isSelected);
    }

    render(){
        return(
            <TouchableOpacity style={[styles.contactSelect, this.state.isSelected? {backgroundColor:'grey'}:{backgroundColor:'transparent'}]} onPress={this.selectItem}  >
                <Text style={styles.title}>{this.props.name}</Text>
            </TouchableOpacity>
        )
    }
}

export default SelectableItem;

const styles = StyleSheet.create({
    contactSelect: {
        marginTop: 15,
        height: 40,
        width: 250,
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf:'center'
        
    },
    title: {
        fontSize: 18,
        alignSelf: 'center',
        fontFamily:'Segoe UI'
    },
})