import styles from "./CSInput.module.css";

export default function CSInput({ csInput }) {
  function dragover(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "none";
  }

  function changes(e) {
    let champion_name = e.target.value;
    csInput(champion_name);
  }

  return (
    <form className={styles.container}>
      <div className="search">
        <input
          type="search"
          id="search"
          className={styles.input}
          placeholder="챔피언을 검색하세요"
          onChange={changes}
          onDragOver={(event) => {
            dragover(event);
          }}
        />
      </div>
      <button className={styles.btn}>Search</button>
    </form>
  );
}