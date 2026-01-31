from agents.controller_agent import ControllerAgent

controller = ControllerAgent()

user_prompt = """
Analyze the risks and compliance issues in this clause:
The company may share user data with third parties for advertising and analytics.
"""

result = controller.handle(user_prompt)

print("\nFINAL CONTROLLER OUTPUT:")
print(result)
