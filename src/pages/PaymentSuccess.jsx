function PaymentSuccess({
  selectedPlan,
  onContinue,
}) {
  return (
    <div className="success-page">

      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>
          Payment Successful
        </h1>

        <p>
          Your{" "}
          <strong>
            {selectedPlan.toUpperCase()}
          </strong>{" "}
          plan has been activated.
        </p>

        <button
          className="success-btn"
          onClick={onContinue}
        >
          Continue To Dashboard
        </button>

      </div>

    </div>
  );
}

export default PaymentSuccess;