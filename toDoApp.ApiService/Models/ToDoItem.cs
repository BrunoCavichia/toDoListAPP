namespace toDoApp.ApiService.Models
{
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("todoitems")]
    public class TodoItem
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
