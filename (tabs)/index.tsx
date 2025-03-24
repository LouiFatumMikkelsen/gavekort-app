<View style={styles.cardTop}>
  {card.type === 'logo' ? (
    <Image 
      source={card.logo} 
      style={styles.storeLogo}
      resizeMode="contain"
    />
  ) : (
    <Text style={[styles.storeText, { color: card.textColor }]}>
      {card.store}
    </Text>
  )}
</View> 