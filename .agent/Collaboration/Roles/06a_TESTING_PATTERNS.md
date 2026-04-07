---
name: e2e-testing-patterns
description: "Vyvoo-spezifische Testing-Patterns und Konventionen für alle Testschichten."
risk: safe
source: self
date_added: "2026-03-24"
---

# Vyvoo Testing Patterns

## Namenskonventionen

```
tests/e2e/
  restaurant-page.spec.ts      # Feature-basiert
  mutterschiff-landing.spec.ts  # App-basiert
  role-access.spec.ts           # Concern-basiert

apps/mutterschiff-api.Tests/
  RestaurantApiTests.cs          # Endpoint-Gruppe

apps/mutterschiff-web/tests/
  slug-validation.test.ts        # Utility-basiert
```

## Test-Struktur

### E2E (Playwright)
```typescript
test.describe('Feature Name', () => {
  test('should [erwartetes Verhalten] when [Kontext]', async ({ page }) => {
    // Arrange: Navigate / Setup
    // Act: Interact
    // Assert: Verify
  });
});
```

### API Integration (xUnit)
```csharp
[Fact]
public async Task EndpointName_Scenario_ExpectedResult()
{
    // Arrange → Act → Assert
}

[Theory]
[InlineData("input", expected)]  // Für parametrisierte Tests
public async Task EndpointName_EdgeCases(string input, bool expected) { }
```

### Unit (Vitest)
```typescript
describe('Module/Function', () => {
  it('should [Verhalten]', () => {
    expect(actual).toBe(expected);
  });
});
```

## Regeln

1. **Keine Testdaten auf PROD** — E2E nur gegen DEV
2. **Jeder Test ist isoliert** — kein Test hängt von einem anderen ab
3. **Kein `sleep()`** — nutze Playwright `waitFor`, xUnit async patterns
4. **Fehlschlag = Blocker** — kein Merge zu `main` solange Tests rot sind
5. **Neue Feature = Neue Tests** — der QA Tester im War Room definiert welche