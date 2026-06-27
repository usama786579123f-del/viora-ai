function PromptHistory({
  prompts,
  setPrompt,
}) {
  if (!prompts.length) {
    return null;
  }

  return (
    <div className="prompt-history">

      <h2>
        Recent Prompts
      </h2>

      <div className="history-list">

        {prompts.map(
          (item, index) => (
            <button
              key={index}
              className="history-item"
              onClick={() =>
                setPrompt(item)
              }
            >
              {item}
            </button>
          )
        )}

      </div>

    </div>
  );
}

export default PromptHistory;