import toastr from "toastr";

export function confirmAction(message, onConfirm) {
    toastr.warning(
        `<br />
         <button type="button" id="confirmBtn">Ja</button>
         <button type="button" id="cancelBtn">Annuller</button>`,
        message,
        {
            closeButton: true,
            allowHtml: true,
            timeOut: 0,
            extendedTimeOut: 0,
            tapToDismiss: false,
            onShown: function () {
                document.getElementById("confirmBtn").onclick = function () {
                    toastr.clear();
                    onConfirm();
                };
                document.getElementById("cancelBtn").onclick = function () {
                    toastr.clear();
                };
            }
        }
    );
}
