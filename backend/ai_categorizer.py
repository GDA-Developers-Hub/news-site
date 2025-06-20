import os
from openai import OpenAI
from typing import List, Dict, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the OpenAI client
# It will automatically pick up the OPENAI_API_KEY from environment variables
try:
    client = OpenAI()
    # Test the client to see if the key is valid
    if not os.getenv("OPENAI_API_KEY"):
         raise ValueError("OPENAI_API_KEY not found in environment variables")
    client.models.list() 
    CLIENT_AVAILABLE = True
    print("OpenAI client initialized successfully.")
except Exception as e:
    client = None
    CLIENT_AVAILABLE = False
    print(f"Failed to initialize OpenAI client: {e}")


OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

# Predefined categories for consistency
PREDEFINED_CATEGORIES = [
    "world", "politics", "business", "sports", "entertainment", "technology", 
    "style", "travel", "science", "climate", "weather", "health", 
    "opinion", "general", "crime", "education", "environment"
]

class AICategorizer:
    def is_configured(self) -> bool:
        """Checks if the OpenAI client is available and configured."""
        return CLIENT_AVAILABLE

    def categorize_article(self, title: str, description: Optional[str] = None) -> str:
        """
        Categorize a single article using ChatGPT.
        
        Args:
            title: Article title
            description: Article description (optional)
            
        Returns:
            str: Categorized category name
        """
        if not self.is_configured():
            return "general"
            
        try:
            content = f"Title: {title}"
            if description:
                content += f"\nDescription: {description}"
            
            prompt = f"""
            Analyze the following news article and categorize it into one of these predefined categories:
            {', '.join(PREDEFINED_CATEGORIES)}
            
            Article:
            {content}
            
            Return only the category name, nothing else. Choose the most appropriate category from the list above.
            """
            
            response = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a news categorization expert. Always respond with only the category name from the provided list."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=10,
                temperature=0.1
            )
            
            category = response.choices[0].message.content.strip().lower()
            
            # Validate the response is in our predefined categories
            if category in PREDEFINED_CATEGORIES:
                return category
            else:
                # Fallback to a default category if AI response is not in our list
                return "general"
                
        except Exception as e:
            print(f"Error categorizing article: {e}")
            return "general"
    
    def categorize_articles_batch(self, articles: List[Dict]) -> List[Dict]:
        """
        Categorize multiple articles in batch.
        
        Args:
            articles: List of article dictionaries
            
        Returns:
            List[Dict]: Articles with updated categories
        """
        if not self.is_configured():
            print("Skipping AI batch categorization: Client not configured.")
            return articles # Return original articles

        categorized_articles = []
        
        for article in articles:
            try:
                # Skip if already has a good category
                current_category = article.get('category', '').lower()
                if current_category in PREDEFINED_CATEGORIES:
                    categorized_articles.append(article)
                    continue
                
                # Categorize using AI
                ai_category = self.categorize_article(
                    title=article.get('title', ''),
                    description=article.get('description')
                )
                
                # Update article with AI category
                article['category'] = ai_category
                article['ai_categorized'] = True
                categorized_articles.append(article)
                
            except Exception as e:
                print(f"Error processing article '{article.get('title', 'Unknown')}': {e}")
                article['category'] = 'general'
                article['ai_categorized'] = False
                categorized_articles.append(article)
        
        return categorized_articles
    
    def get_category_suggestions(self, title: str, description: Optional[str] = None) -> List[str]:
        """
        Get multiple category suggestions for an article.
        
        Args:
            title: Article title
            description: Article description (optional)
            
        Returns:
            List[str]: List of suggested categories in order of relevance
        """
        if not self.is_configured():
            return ["general"]

        try:
            content = f"Title: {title}"
            if description:
                content += f"\nDescription: {description}"
            
            prompt = f"""
            Analyze the following news article and suggest the top 3 most appropriate categories from this list:
            {', '.join(PREDEFINED_CATEGORIES)}
            
            Article:
            {content}
            
            Return only the category names separated by commas, in order of relevance.
            """
            
            response = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a news categorization expert. Return only category names separated by commas."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,
                temperature=0.2
            )
            
            suggestions = response.choices[0].message.content.strip().lower().split(',')
            suggestions = [s.strip() for s in suggestions if s.strip() in PREDEFINED_CATEGORIES]
            
            return suggestions[:3]  # Return top 3 suggestions
            
        except Exception as e:
            print(f"Error getting category suggestions: {e}")
            return ["general"]

# Global instance
ai_categorizer_instance = None

def get_ai_categorizer() -> Optional[AICategorizer]:
    """Get the global AI categorizer instance."""
    global ai_categorizer_instance
    if ai_categorizer_instance is None:
        ai_categorizer_instance = AICategorizer()
    return ai_categorizer_instance 