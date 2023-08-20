import React, { useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { RootSiblingParent } from 'react-native-root-siblings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import Animated, { SharedValue, interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

if (!__DEV__) {
    enableScreens();
}

const App = () => {
    const scrollOffset = useSharedValue(0);
    return (
        <RootSiblingParent>
            <GestureHandlerRootView>
                <SafeAreaProvider>
                    <HeaderedListItem header={<View />} scrollValue={scrollOffset}>
                        <View style={{height: 200}} />
                    </HeaderedListItem>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </RootSiblingParent>
    );
}

export default App;

export const MIN_HEIGHT = 50;

export const HeaderedListItem = (props) => {
    const [yOffset, setYOffset] = useState(0);
    const [height, setHeight] = useState(MIN_HEIGHT);
    const style = useAnimatedStyle(() => ({
        transform: !props.scrollValue ? [] : [{
            translateY: interpolate(
                props.scrollValue.value,
                [-1000, yOffset, yOffset + Math.max(0, height - MIN_HEIGHT), yOffset + 10 + height + 100],
                [0, 0, height - MIN_HEIGHT, height - MIN_HEIGHT],
            )
        }],
    }), [props.scrollValue, yOffset, height]);
    const onLayout = useCallback((e) => {
        setYOffset(e.nativeEvent.layout.y - 100);
        setHeight(Math.max(e.nativeEvent.layout.height, MIN_HEIGHT));
    }, [setHeight, setYOffset]);
    return (
        <View onLayout={onLayout}>
            <Animated.View style={style}>
                <Animated.View />
                {props.header}
            </Animated.View>
            {props.children}
        </View>
    )
}
