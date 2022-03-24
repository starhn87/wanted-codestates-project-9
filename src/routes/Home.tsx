import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { useQuery } from 'react-query'
import { searchApi } from '../api'
import UserInfo from '../components/UserInfo'
import { MdInfo } from 'react-icons/md'
import Card from '../components/Card'
import Loading from '../components/Loading'
import Donut from '../components/Donut'
import LineCard from '../components/LineCard'
import Match from '../components/Match'
import { home, reset } from '../redux/slice'
import Tab from '../components/Tab'
import { shallowEqual } from 'react-redux'
import Cheer from '../components/Cheer'
import Default from '../components/Default'

export default function Home() {
  const { nickname, gameType } = useAppSelector(
    (state) => ({
      nickname: state.user.nickname,
      gameType: state.user.gameType,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { data, isFetching, refetch } = useQuery(
    [nickname, gameType],
    () => searchApi.username(nickname, gameType),
    {
      staleTime: 60 * 1000,
      retry: false,
      onError: (error) => {
        dispatch(reset())
        alert('에러가 발생하였습니다. 잠시 뒤 다시 시도해주세요.')
      },
    },
  )

  useEffect(() => {
    if (data) {
      dispatch(
        home({
          id: data.userId,
          kart: data.finalKartInfo,
          track: data.finalTrackInfo,
        }),
      )
    }
  }, [data])

  if (isFetching) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    )
  } else if (!data) {
    return (
      <DefaultPageWrapper>
        <Default />
      </DefaultPageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Info>
        <MdInfo style={{ marginRight: 5 }} />
        <span>
          카트라이더 매치데이터는 최근 1년치 데이터만 확인할 수 있습니다
        </span>
      </Info>
      <UserInfo
        nickname={nickname}
        character={data.character}
        refetch={refetch}
      />
      <Container>
        <Card point="종합" title="전적">
          <ChartWrapper>
            <Donut {...data.winRateData} />
            <Donut {...data.noRetiredData} />
            <Donut {...data.retiredData} />
          </ChartWrapper>
          <Mode>
            <ModeText className="blue">최다주행</ModeText>{' '}
            <ModeText>모드</ModeText>
            <ModeText className="rank">통합</ModeText>
          </Mode>
        </Card>
        <Card point="순위변동" title="추이">
          <LineCard data={data.ranksPart} />
        </Card>
        <Card point="응원" title="한마디">
          <Cheer />
        </Card>
      </Container>
      <Box>
        <Record>
          <Tab />
        </Record>
        <Record>
          {data.record.map((match) => (
            <Match key={match.matchId} data={match} />
          ))}
        </Record>
      </Box>
    </PageWrapper>
  )
}

export const PageWrapper = styled.div`
  width: 1000px;
  min-height: 1000px;
  margin: auto;
  padding-bottom: 100px;

  @media (min-width: 1630px) {
    width: 1300px;
  }
`

const DefaultPageWrapper = styled.div`
  width: 100%;
  min-width: 1300px;
`

const Info = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 15px;
  font-size: 12px;
`

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  margin-top: 20px;
`

const ChartWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: center;
`

const Box = styled.div`
  display: grid;
  margin-top: 20px;
  grid-template-columns: 1fr 2fr;
`

const Record = styled.div`
  :not(:last-child) {
    margin-right: 10px;
  }
`

const Mode = styled.div`
  position: relative;
  margin: 8px;
  padding: 8px;
  border-top: 1px solid #f2f2f2;
  line-height: 30px;
`

const ModeText = styled.span`
  font-size: 14px;

  &.blue {
    color: var(--blue);
  }

  &.rank {
    position: absolute;
    right: 8px;
    font-size: 20px;
    font-weight: bold;
  }
`
