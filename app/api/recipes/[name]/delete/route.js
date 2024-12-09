import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import Recipe from '@/server/models/Recipe.mjs';
import UserRecipes from '@/server/models/UserRecipes.mjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route.js';
import UserLikes from '@/server/models/UserLikes.mjs';

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession({ req, authOptions });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
        }

        const { name } = await params;

        if (!name) {
            return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
        }

        const userRecipe = await UserRecipes.find({ username: session.user.name, recipeName: name });
        if (!userRecipe || userRecipe.length === 0) {
            return NextResponse.json({ error: 'Recipe not found in user recipes, this Recipe may not be owned by you' }, { status: 404 });
        }

        const recipe = await Recipe.find({ name });
        if (!recipe || recipe.length === 0) {
            return NextResponse.json({ error: 'Recipe not found for deletion' }, { status: 404 });
        }

        const recipeDeletion = await Recipe.deleteOne({ name });
        const userRecipesDeletion = await UserRecipes.deleteMany({ recipeName: name });

        const userLikes = await UserLikes.find({ recipeName: name });
        if (userLikes && userLikes.length > 0) {
            await UserLikes.deleteMany({ recipeName: name });
        }

        return NextResponse.json(
            { 
                message: 'Recipe and associated references deleted successfully', 
                details: {
                    recipeDeleted: recipeDeletion.deletedCount,
                    userRecipesDeleted: userRecipesDeletion.deletedCount,
                    userLikesDeleted: userLikes.length,
                }
            }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting recipe and associated references:', error);
        return NextResponse.json({ error: 'Error deleting recipe' }, { status: 500 });
    }
}