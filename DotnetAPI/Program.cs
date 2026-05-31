using DotnetAPI.Repositories;
using DotnetAPI.Services;

var builder = WebApplication.CreateBuilder(args);// builds server that will respond to our requests

var connectionString = "Data Source=expenses.db";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<CategoryRepository>(new CategoryRepository(connectionString));
builder.Services.AddSingleton<TransactionRepository>(new TransactionRepository(connectionString));

builder.Services.AddSingleton<CsvImportService>(new CsvImportService(
    new CategoryRepository(connectionString)
));
builder.Services.AddSingleton<AnalyticsService>(new AnalyticsService(
    new TransactionRepository(connectionString)
));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // default Vite port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowReact");

new DatabaseBootstrap(connectionString).Initialize();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

