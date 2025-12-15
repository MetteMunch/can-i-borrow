<script>
  export let message = 'Er du sikker?';
  export let onConfirm = () => {};
  export let onCancel = () => {};
</script>

<div class="overlay">
  <div class="dialog">
    <p>{message}</p>

    <div class="buttons">
      <button class="confirm" onclick={onConfirm}>Ja</button>
      <button class="cancel" onclick={onCancel}>Annuller</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .dialog {
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    min-width: 280px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .confirm {
    background: #2e7d32;
    color: white;
  }
  .cancel {
    background: #ccc;
  }
</style>
