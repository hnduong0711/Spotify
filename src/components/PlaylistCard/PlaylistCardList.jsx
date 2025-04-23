import Slider from 'react-slick'
import PlaylistItem from './PlaylistItem'

function PlaylistCardList({ title, data }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Slider {...settings}>
        {data.map(playlist => (
          <PlaylistItem key={playlist.id} playlist={playlist} />
        ))}
      </Slider>
    </div>
  )
}

export default PlaylistCardList