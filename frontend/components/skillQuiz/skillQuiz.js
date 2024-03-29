import { useEffect, useRef, useState } from "react";
import styles from "./skillQuiz.module.css";
import championList from "../../utils/champion";
import axios from "axios";
import { skillquiz } from "../../api/api";
import { mapLinear } from "three/src/math/MathUtils";

export default function SkillQuiz({ setMode }) {
  const clist = championList();
  const [randomChampion, setRandomChampion] = useState(
    Math.floor(Math.random() * 161)
  );
  const [randomSkill, setRandomSkill] = useState(Math.floor(Math.random() * 5));
  const [value, setValue] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameStart, setGameStart] = useState(false);
  const [info, setInfo] = useState("");
  const intervalId = useRef(null);
  const [ranking, setRanking] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [name, setName] = useState("");
  const [bools, setBools] = useState(false);
  const [relocation, setRelocation] = useState(false);
  useEffect(() => {
    axios({
      method: "get",
      url: skillquiz.getAll(),
    })
      .then((res) => {
        setRanking(res.data);
        if(res.data.length >= 10){
          setMinScore(res.data[res.data.length - 1].score);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (timer < 0) {
      clearInterval(intervalId.current);
      axios({
        method: "get",
        url: skillquiz.getAll(),
      })
        .then((res) => {
          setRanking(res.data);
          if(res.data.length>=10){
            setMinScore(res.data[res.data.length - 1].score);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [timer]);

  useEffect(() => {
    setValue("");
  }, [randomChampion, randomSkill]);

  useEffect(() => {
    axios({
      method: "get",
      url: skillquiz.getAll(),
    })
      .then((res) => {
        setRanking(res.data);
        if(res.data.length>=10){
          setMinScore(res.data[res.data.length - 1].score);
        }
        setRelocation(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [relocation]);
  return (
    <>
      {gameStart === false && (
        <div className={styles.container}>
          <div className={styles.quiz}>
            1분동안 제시된 스킬을 가진 챔피언을 맞추세요!
          </div>
          <button
            className={styles.btn}
            onClick={() => {
              setGameStart(true);
              intervalId.current = setInterval(
                () => setTimer((timer) => timer - 1),
                1000
              );
            }}
          >
            게임 시작
          </button>
        </div>
      )}

      {gameStart === true && timer >= 0 && (
        <>
          <div className={styles.container}>
            <div className={styles.timer}>{timer}</div>
            <div className={styles.quiz}>
              해당 스킬을 가진 챔피언을 입력하시오.
            </div>
            {randomSkill === 0 ? (
              <img
                src={`/passive/${clist[randomChampion].passive}.png`}
                id={clist[randomChampion].ko}
                alt={clist[randomChampion].en}
              />
            ) : randomSkill === 1 ? (
              <img
                src={`/skill/${clist[randomChampion].Q}.png`}
                id={clist[randomChampion].ko}
                alt={clist[randomChampion].en}
              />
            ) : randomSkill === 2 ? (
              <img
                src={`/skill/${clist[randomChampion].W}.png`}
                id={clist[randomChampion].ko}
                alt={clist[randomChampion].en}
              />
            ) : randomSkill === 3 ? (
              <img
                src={`/skill/${clist[randomChampion].E}.png`}
                id={clist[randomChampion].ko}
                alt={clist[randomChampion].en}
              />
            ) : (
              <img
                src={`/skill/${clist[randomChampion].R}.png`}
                id={clist[randomChampion].ko}
                alt={clist[randomChampion].en}
              />
            )}
            <div className={styles.textandi}>
              <input
                className={styles.text}
                placeholder="챔피언 이름"
                value={value}
                required={true}
                onChange={(event) => {
                  setValue(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (value === clist[randomChampion].ko) {
                      setInfo("맞았습니다!");
                      setScore((score) => score + 1);
                    } else {
                      setInfo("틀렸습니다!");
                    }
                    setRandomChampion(() => {
                      return Math.floor(Math.random() * 161);
                    });
                    setRandomSkill(() => {
                      return Math.floor(Math.random() * 5);
                    });
                  }
                }}
              ></input>
              <i></i>
            </div>
            <button
              className={styles.btn}
              onClick={() => {
                if (value === clist[randomChampion].ko) {
                  setInfo("맞았습니다!");
                  setScore((score) => score + 1);
                } else {
                  setInfo("틀렸습니다!");
                }
                setRandomChampion(() => {
                  return Math.floor(Math.random() * 161);
                });
                setRandomSkill(() => {
                  return Math.floor(Math.random() * 5);
                });
              }}
            >
              입력
            </button>

            <div
              className={info === "맞았습니다!" ? styles.answer : styles.wrong}
            >
              {info}
            </div>
          </div>
        </>
      )}
      {gameStart === true && timer < 0 && (
        <div className={styles.container}>
          <div className={styles.showcount}>{score}개를 맞추셨어요!</div>
          <div className={styles.msg}>{score < 5 && " 좀더 분발하세요!"}</div>
          <div className={styles.msg}>
            {score < 10 && score >= 5 && " 롤을 해보긴 하셨군요."}
          </div>
          <div className={styles.msg}>
            {score < 15 && score >= 10 && " 상당한 실력의 소유자시군요!"}
          </div>
          <div className={styles.msg}>
            {score >= 15 && " 롤을 그만하셔야 될 것 같습니다!"}
          </div>
          <h1 className={styles.msg}>랭킹</h1>
          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>순위</th>
                  <th>이름</th>
                  <th>점수</th>
                </tr>
              </thead>
              {ranking &&
                ranking.map((item, idx) => {
                  return (
                    <tbody key={idx}>
                      <tr>
                        <td>{idx + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.score}</td>
                      </tr>
                    </tbody>
                  );
                })}
            </table>
          </div>
          {(score > minScore || ranking.length < 10) && !bools && (
            <>
              <input
                className={styles.name}
                placeholder="랭킹에 등록할 이름을 입력하세요!"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
              <button
                className={styles.btn}
                onClick={() => {
                  axios({
                    method: "post",
                    url: skillquiz.register(),
                    data: {
                      name: name,
                      score: score,
                    },
                  })
                    .then((res) => {
                      setRanking((ranking) => {
                        if (ranking) {
                          const newRanking = [...ranking];
                          newRanking.splice(0);
                          return newRanking;
                        }
                      });
                      setRelocation(true);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                  setBools(true);
                }}
              >
                랭킹 등록
              </button>
            </>
          )}
          <button
            className={styles.btn}
            onClick={() => {
              setGameStart(false);
              setScore(0);
              setTimer(60);
              setInfo("");
              setRandomChampion(() => {
                return Math.floor(Math.random() * 161);
              });
              setRandomSkill(() => {
                return Math.floor(Math.random() * 5);
              });
              setBools(false);
            }}
          >
            메인화면으로
          </button>
        </div>
      )}
    </>
  );
}
