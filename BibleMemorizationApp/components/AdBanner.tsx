import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const AD_UNIT_ID = 'ca-app-pub-8936592815849801/6096191598';

export default function AdBanner() {
  return (
    <View style={{ alignItems: 'center' }}>
      <BannerAd unitId={AD_UNIT_ID} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}
