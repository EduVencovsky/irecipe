import React from 'react'
import { View } from 'react-native'
import { Title, List, Divider, Subheading } from 'react-native-paper'

const HomeScreen = () => {
  return (
    <View style={{ margin: 20 }}>
      <Title>Trabalho Engenharia de Software 2</Title>
      <Divider />
      <Subheading>Participantes</Subheading>
      <List.Item title="Eduardo Vencovsky" description="201710281" />
      <List.Item title="Erick Domingos Modenez" description="201710299" />
      <List.Item title="Igor Prata" description="201710277" />
      <List.Item title="Leonardo Vencovsky" description="201710276" />
      <List.Item title="Vitor Facioli" description="201710292" />
      <List.Item title="Yan Trevizam" description="201710283" />
    </View>
  )
}

export default HomeScreen
