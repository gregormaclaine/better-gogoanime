import styled from 'styled-components';
import cross_icon_img from '../img/cross.svg';

const CrossIcon = styled.img`
  display: none;
  position: absolute;
  height: 30px;
  width: auto;
  top: 5px;
  right: 5px;
  cursor: pointer;

  background: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%, rgba(0,0,0,0) 100%);
  border-radius: 50%;
  padding: 1px;

  &:hover {
    display: block;
    opacity: 1 !important;
  }
`;

const AnimeItemWrapper = styled.li`
  float: left;
  position: relative;
  margin-left: 1.8867%;
  width: 23.5849%;
  text-align: center;
  list-style: none;
  margin-bottom: 20px;
  vertical-align: top;

  &:nth-child(4n+1) { margin-left: 0; }

  &:hover > ${CrossIcon} {
    display: block;
    opacity: 0.4;
  }
`;

const ImportedAnimeItem = styled.div`
  & > .img {
    height: 230px;
    overflow: hidden;

    & div.type { display: none; }

    & > a {
      width: 100%;
      height: 100%;

      & > img {
        width: 100%;
        max-width: 100%;
        height: auto;
      }
    }
  }

  & > .name {
    line-height: 16px;
    height: 34px;
    overflow: hidden;
    margin: 8px 0;

    & > a {
      color: #ffc119;
      font-size: 13px;
      text-decoration: none;
      font-family: mySecondFont;
    }
  }

  & > .episode {
    margin: 0;
    padding: 0;
    color: #e1e1e1;
    font-size: 12px;
    font-family: mySecondFont;
  }
`;

function AnimeItem({ name, episode, urlpath, html, blacklist_item }) {
    return (
        <AnimeItemWrapper key={urlpath}>
            <ImportedAnimeItem dangerouslySetInnerHTML={{ __html: html }} />
            <CrossIcon src={cross_icon_img} alt={'Blacklist ' + name} onClick={() => blacklist_item(name)}/>
        </AnimeItemWrapper>
    );
}

export default AnimeItem;
