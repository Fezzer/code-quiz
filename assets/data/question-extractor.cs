// LinqPad script to convert the questions from the README.md to JSON.
var input = File.ReadAllText(@"e:\bootcamp\code-quiz\assets\data\README.md");
var output = @"e:\bootcamp\code-quiz\assets\data\questions.json";

var regex = new Regex(
	@"######\s+(?'questionNumber'\d+)\.\s(?'question'.+?)\n" + 
	@"(?'answers'-\s*(?'answerIndex'.+?):(?'answer'.+?)\n)+.+?" +
	@"####\s+Answer:(?'correctAnswer'.+?)\n(?'explanation'.+?)</p>.+?---", 
	RegexOptions.Singleline);

var questions = regex.Matches(input)
	.Select(m => new
	{
		Id = m.Groups["questionNumber"].Value.Trim(),
		Question = m.Groups["question"].Value.Trim().AddPreTag(),
		Answers = m.Groups["answerIndex"].Captures.Zip(m.Groups["answer"].Captures)
			.Select(x => new 
			{
				Id = x.First.Value.Trim(), 
				Answer = x.Second.Value.Trim().Replace("`", string.Empty),
				IsCorrect = x.First.Value.Trim() == m.Groups["correctAnswer"].Value.Trim()
			}),
		Explanation = m.Groups["explanation"].Value.Trim()
	});
	
Console.Write($"Do all questions have a correct answer? {questions.Any(q => q.Answers.All(a => !a.IsCorrect)).ToString()}");

using var writer = File.Create(output);

JsonSerializer.Serialize(
	writer, 
	questions, 
	new JsonSerializerOptions 
	{ 
		PropertyNamingPolicy = JsonNamingPolicy.CamelCase, 
		WriteIndented = true
	});
	
static class LocalExtensions
{
	public static string AddPreTag(this string source)
	{
		return 
			Regex.Replace(source, @"```(javascript|html)", "<pre class='code'>")
			.Replace("```", "</pre>");
	}
}