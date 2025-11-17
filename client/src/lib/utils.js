export function formatMessageTime(date){
    return date.toLocaleString('en-US', {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}