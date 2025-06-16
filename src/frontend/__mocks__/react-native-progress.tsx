// These are mocked because their animations cause warnings.
//
// React wants you to use the ["Act Arrange Assert" test pattern][0]. That means
// you should set up your components, then assert on them. After your components
// are set up, they shouldn't change. If they *do* change, you'll get a warning.
//
// These indicator components are animated, so they change after being set up,
// so they cause a warning. So we mock them.
//
// [0]: https://wiki.c2.com/?ArrangeActAssert

import {View} from 'react-native';

const Empty = () => <View />;

export const Bar = Empty;
export const Circle = Empty;
export const CircleSnail = Empty;
export const Pie = Empty;
