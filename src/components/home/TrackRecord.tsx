import React, { ChangeEvent, useEffect, useState } from 'react'
import { KartRecordProps } from '../../interface'
import { useAppSelector } from '../../redux/store'
import { formatTime } from '../../util'
import { TabContent, Table, TableBox, Td, Th, Thead, Tr } from './KartRecord'

export default function TrackRecord({
  onTrackError,
}: Pick<KartRecordProps, 'onTrackError'>) {
  const { track: trackInfo } = useAppSelector((state) => state.user)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    setSelected(0)
  }, [trackInfo])

  return (
    <TabContent>
      <TableBox>
        <Table>
          <Thead>
            <tr>
              <Th>선택</Th>
              <Th>트랙</Th>
              <Th>횟수</Th>
              <Th>승률</Th>
              <Th>기록</Th>
            </tr>
          </Thead>
          <tbody>
            {trackInfo.map((track, index) => (
              <Tr
                key={track.id}
                className={`${selected === index ? 'active' : ''}`}
              >
                <Td>
                  <input
                    type="radio"
                    value={index}
                    checked={selected === index}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSelected(Number(e.target.value))
                    }
                  ></input>
                </Td>
                <Td className="left">
                  <img
                    // src={`https://s3-ap-northeast-1.amazonaws.com/solution-userstats/kartimg/Category/${track.id}_1.png`}
                    src="https://s3-ap-northeast-1.amazonaws.com/solution-userstats/kartimg/Category/unknown_1.png"
                    alt="트랙 이미지"
                    onError={onTrackError}
                    height={27}
                  />
                  &nbsp; {track.name}
                </Td>
                <Td>{track.count}</Td>
                <Td>{`${Math.round(
                  (track.winCount / track.count) * 100,
                )}%`}</Td>
                <Td>
                  {track.min === Number.MAX_SAFE_INTEGER
                    ? '-'
                    : formatTime(track.min)}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableBox>
    </TabContent>
  )
}
