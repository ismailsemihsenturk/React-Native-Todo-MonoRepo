import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from "./Tasks_Style.js"

export default function Tasks(props) {
    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.square}></View>
                <Text style={styles.itemText}>{props.task.name}</Text>
            </View>
            <View style={styles.circular}></View>
        </View>
    )
}
