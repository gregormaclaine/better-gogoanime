import React from 'react';
import styled from 'styled-components';
import cross_icon_img from '../img/cross.svg';
import tick_icon_img from '../img/tick.svg';

const Icon = styled.img`
  display: none;
  position: absolute;
  height: 30px;
  width: auto;
  top: 5px;
  right: 5px;
  cursor: pointer;

  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 80%,
    rgba(0, 0, 0, 0) 100%
  );
  border-radius: 50%;
  padding: 1px;

  &:hover {
    display: block;
    opacity: 1 !important;
  }
`;

const AnimeItemWrapper = styled.div<{ blacklisted: boolean }>`
  position: relative;
  width: 23.5849%;
  text-align: center;
  margin-bottom: 20px;
  ${props => (props.blacklisted ? 'background-color: #3B1B1B;' : '')}

  &:hover > ${Icon} {
    display: block;
    opacity: 0.4;
  }
`;

const ImportedAnimeItem = styled.div`
  & > .img {
    height: 230px;
    overflow: hidden;
    background-color: #1b1b1b;

    & div.type {
      display: none;
    }

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

function AnimeItem({
  name,
  episode,
  urlpath,
  html,
  blacklisted,
  blacklist_item,
  unblacklist_item
}: {
  name: string;
  episode: number | 'Unknown';
  urlpath: string;
  html: string;
  blacklisted: boolean;
  blacklist_item: Function;
  unblacklist_item: Function;
}) {
  function onClick() {
    if (blacklisted) unblacklist_item(name);
    else blacklist_item(name);
  }

  return (
    <AnimeItemWrapper blacklisted={blacklisted}>
      <ImportedAnimeItem dangerouslySetInnerHTML={{ __html: html }} />
      <Icon
        onClick={onClick}
        src={blacklisted ? tick_icon_img : cross_icon_img}
        alt={`${blacklisted ? 'White' : 'Black'}list ${name}`}
      />
    </AnimeItemWrapper>
  );
}

export default AnimeItem;
