using System.Diagnostics.CodeAnalysis;
using Component.Form.Application.ComponentHandler;

namespace Component.Form.Application.ComponentHandler.Tests;

[ExcludeFromCodeCoverage]
public class ExpressionHelperTests
{
    [Fact]
    public void EvaluateExpression_does_not_allow_me_to_run_Process()
    {
        // arrange
        var script = @"
            // The command you want to execute
            string command = ""echo Hello from cmd!"";

            // Create a new process to execute cmd
            Process process = new Process();
            process.StartInfo.FileName = ""cmd.exe"";
            process.StartInfo.Arguments = $""/c {command}""; // /c runs the command and terminates the cmd process
            
            // Redirect output so we can read it from C#
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;
            
            // Start the process and read the output
            process.Start();
            string output = process.StandardOutput.ReadToEnd();
            
            // Wait for the process to exit
            process.WaitForExit();
            
            // Print the output
            Console.WriteLine(output);
        ";

        // act
        var result = ExpressionHelper.EvaluateCondition(script, new { });
        
        // assert
        Assert.Equal(TaskStatus.Faulted, result.Status);
        Assert.Contains("The type or namespace name 'Process' could not be found", result.Exception.Message);
    }

    [Fact]
    public void EvaluateExpression_does_not_allow_me_create_a_file()
    {
        // arrange
        var script = @"
            // Create a file
            File.WriteAllText(""test.txt"", ""Hello, World!"");
        ";

        // act
        var result = ExpressionHelper.EvaluateCondition(script, new { });

        // assert
        Assert.Equal(TaskStatus.Faulted, result.Status);
        Assert.Contains("The name 'File' does not exist in the current context", result.Exception.Message);
    }
}
