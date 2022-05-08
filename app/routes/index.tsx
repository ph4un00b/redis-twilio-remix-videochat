import ContentBlock from '~/components/molecules/ContentBlock'
import { Header, Footer, RoomLogin } from '~/components/organisms/RoomLogin'

export default function Index () {
  return (
    <ContentBlock>
      <Header />
      <RoomLogin />
      <Footer />
    </ContentBlock>
  )
}
